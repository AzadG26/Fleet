// backend/routes/kabadiwala.js
import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/* ============================================================
   🟢 ADD NEW KABADIWALA PURCHASE (AUTO RATE)
============================================================ */
router.post("/add", async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      company_id,
      godown_id,
      vendor_id,
      scraps,
      payment_amount = 0,
      payment_mode = "cash",
      account_id,
      note = "",
      date = new Date().toISOString().split("T")[0]
    } = req.body;

    if (!company_id || !godown_id || !vendor_id)
      return res.status(400).json({ error: "Missing required fields" });

    if (!scraps?.length)
      return res.status(400).json({ error: "Scrap items required" });

    await client.query("BEGIN");

    /* 🔥 Fetch Vendor Name */
    const vRes = await client.query(
      `SELECT name FROM vendors WHERE id=$1`,
      [vendor_id]
    );
    if (vRes.rowCount === 0)
      return res.status(404).json({ error: "Vendor not found" });

    const kabadiwala_name = vRes.rows[0].name;

    let totalAmount = 0;

    /* 1️⃣ Create Main Record */
    const mainRes = await client.query(
      `
      INSERT INTO kabadiwala_records
      (id, company_id, godown_id, vendor_id, kabadiwala_name, date, total_amount, payment_mode, payment_status, created_at)
      VALUES (
        uuid_generate_v4(), $1, $2, $3, $4, $5, 0, $6, 'pending', NOW()
      )
      RETURNING id
      `,
      [company_id, godown_id, vendor_id, kabadiwala_name, date, payment_mode]
    );

    const kabadi_id = mainRes.rows[0].id;

    /* 2️⃣ Insert Scrap Items (Auto Rate) */
    for (const s of scraps) {
      const rateRes = await client.query(
        `
        SELECT vr.vendor_rate, st.material_type
        FROM vendor_rates vr
        JOIN scrap_types st ON st.id = vr.scrap_type_id
        WHERE vr.vendor_id = $1 AND vr.scrap_type_id = $2
        `,
        [vendor_id, s.scrap_type_id]
      );

      if (rateRes.rowCount === 0)
        return res.status(400).json({
          error: `Vendor does not have rate for scrap_type_id ${s.scrap_type_id}`
        });

      const rate = Number(rateRes.rows[0].vendor_rate);
      const material = rateRes.rows[0].material_type;
      const weight = Number(s.weight);
      const amount = rate * weight;
      totalAmount += amount;

      await client.query(
        `
        INSERT INTO kabadiwala_scraps
        (id, kabadiwala_id, scrap_type_id, material, weight, rate, amount)
        VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6)
        `,
        [kabadi_id, s.scrap_type_id, material, weight, rate, amount]
      );
    }

    /* 3️⃣ Update Total Amount */
    await client.query(
      `UPDATE kabadiwala_records SET total_amount=$1 WHERE id=$2`,
      [totalAmount, kabadi_id]
    );

    /* 4️⃣ Payment Handling */
    let payment_status = "pending";
    const paid = Number(payment_amount);

    if (paid >= totalAmount) payment_status = "paid";
    else if (paid > 0) payment_status = "partial";

    await client.query(
      `UPDATE kabadiwala_records SET payment_status=$1 WHERE id=$2`,
      [payment_status, kabadi_id]
    );

    /* 5️⃣ Log Payment */
    if (paid > 0) {
      await client.query(
        `
        INSERT INTO kabadiwala_payments
        (id, kabadiwala_id, amount, mode, note, date, created_at)
        VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, NOW())
        `,
        [kabadi_id, paid, payment_mode, note, date]
      );

      /* Account Ledger */
      if (account_id) {
        await client.query(
          `
          INSERT INTO account_transactions
          (id, company_id, godown_id, account_id, type, amount, category, reference, created_at)
          VALUES (uuid_generate_v4(), $1, $2, $3, 'debit', $4, 'kabadiwala payment', $5, NOW())
          `,
          [company_id, godown_id, account_id, paid, `Payment to ${kabadiwala_name}`]
        );

        await client.query(
          `UPDATE accounts SET balance = balance - $1 WHERE id=$2`,
          [paid, account_id]
        );
      }
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      kabadi_id,
      message: "Kabadiwala purchase recorded successfully"
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ KABADIWALA ADD ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/* ============================================================
   🟣 LIST RECORDS (MANAGER)
============================================================ */
router.get("/list", async (req, res) => {
  try {
    const { company_id, godown_id } = req.query;

    const q = `
      SELECT
        kr.*,
        COUNT(ks.id) AS items_count,
        COALESCE(SUM(ks.weight),0) AS total_weight,
        COALESCE(SUM(ks.amount),0) AS scrap_total,
        COALESCE((SELECT SUM(amount) FROM kabadiwala_payments WHERE kabadiwala_id=kr.id),0) AS total_paid
      FROM kabadiwala_records kr
      LEFT JOIN kabadiwala_scraps ks ON ks.kabadiwala_id = kr.id
      WHERE kr.company_id=$1 AND kr.godown_id=$2
      GROUP BY kr.id
      ORDER BY kr.date DESC
    `;

    const r = await pool.query(q, [company_id, godown_id]);
    res.json({ success: true, kabadiwala: r.rows });

  } catch (err) {
    console.error("❌ LIST ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});


/* ============================================================
   🟢 OWNER VIEW (Flat List)
============================================================ */
router.get("/owner-list", async (req, res) => {
  try {
    const { company_id, godown_id, date } = req.query;

    const q = `
      SELECT
        kr.date,
        kr.kabadiwala_name AS kabadi_name,
        ks.material,
        ks.weight,
        ks.rate,
        ks.amount,
        kr.payment_status
      FROM kabadiwala_records kr
      JOIN kabadiwala_scraps ks ON ks.kabadiwala_id = kr.id
      WHERE kr.company_id=$1
        AND kr.godown_id=$2
        AND ($3::date IS NULL OR kr.date = $3::date)
      ORDER BY kr.date DESC
    `;

    const r = await pool.query(q, [company_id, godown_id, date || null]);

    res.json({ success: true, entries: r.rows });

  } catch (err) {
    console.error("❌ OWNER LIST ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
