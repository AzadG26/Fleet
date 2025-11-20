// backend/routes/feriwala.js
import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/* --------------------------------------------------------
   1️⃣ ADD NEW FERIWALA PURCHASE (AUTO RATE FROM vendor_rates)
-------------------------------------------------------- */
router.post("/add", async (req, res) => {
  const client = await pool.connect();

  try {
    const { company_id, godown_id, vendor_id, scraps, account_id } = req.body;

    if (!company_id || !godown_id || !vendor_id || !scraps?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!account_id) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    await client.query("BEGIN");

    /* 🔥 Get vendor name */
    const vendorRes = await client.query(
      `SELECT name FROM vendors WHERE id = $1`,
      [vendor_id]
    );

    if (vendorRes.rowCount === 0)
      return res.status(404).json({ error: "Vendor not found" });

    const vendor_name = vendorRes.rows[0].name;

    let totalAmount = 0;

    /* CREATES MAIN FERIWALA RECORD */
    const mainRecord = await client.query(
      `
      INSERT INTO feriwala_records 
      (id, company_id, godown_id, vendor_id, date, total_amount, created_at)
      VALUES (uuid_generate_v4(), $1, $2, $3, CURRENT_DATE, 0, NOW())
      RETURNING id;
      `,
      [company_id, godown_id, vendor_id]
    );

    const feriwala_id = mainRecord.rows[0].id;

    /* --------------------------------------------------------
       FOR EACH SCRAP TYPE:
       - GET global_rate
       - GET vendor_rate from vendor_rates
       - Compute amount = weight × vendor_rate
    -------------------------------------------------------- */
    for (const s of scraps) {
      const rateQuery = await client.query(
        `
        SELECT vr.vendor_rate, st.material_type 
        FROM vendor_rates vr
        JOIN scrap_types st ON st.id = vr.scrap_type_id
        WHERE vr.vendor_id = $1 AND vr.scrap_type_id = $2
        `,
        [vendor_id, s.scrap_type_id]
      );

      if (rateQuery.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: `Vendor does not have rate for this scrap_type_id: ${s.scrap_type_id}`,
        });
      }

      const vendor_rate = Number(rateQuery.rows[0].vendor_rate);
      const material = rateQuery.rows[0].material_type;
      const weight = Number(s.weight);
      const amount = vendor_rate * weight;

      totalAmount += amount;

      /* Insert scrap line */
      await client.query(
        `
        INSERT INTO feriwala_scraps
        (id, feriwala_id, material, weight, rate, amount)
        VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)
        `,
        [feriwala_id, material, weight, vendor_rate, amount]
      );
    }

    /* Update total amount in main record */
    await client.query(
      `
      UPDATE feriwala_records 
      SET total_amount = $1 
      WHERE id = $2
      `,
      [totalAmount, feriwala_id]
    );

    /* LEDGER ENTRY */
    await client.query(
      `
      INSERT INTO account_transactions
      (id, company_id, godown_id, account_id, type, amount, category, reference, metadata, created_at)
      VALUES (uuid_generate_v4(), $1, $2, $3, 'debit', $4, 'feriwala purchase', $5, '{}', NOW())
      `,
      [company_id, godown_id, account_id, totalAmount, `Purchase from ${vendor_name}`]
    );

    /* Update account balance */
    await client.query(
      `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
      [totalAmount, account_id]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      feriwala_id,
      totalAmount,
      vendor: vendor_name,
      message: "Feriwala purchase added successfully (Auto-rate applied)",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Feriwala ADD Error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});


/* --------------------------------------------------------
   2️⃣ FETCH ALL PURCHASES WITH SCRAPS + VENDOR DETAILS
-------------------------------------------------------- */
/* --------------------------------------------------------
   2️⃣ FETCH ALL PURCHASES WITH SCRAPS + VENDOR DETAILS
-------------------------------------------------------- */
router.get("/list", async (req, res) => {
  try {
    const { company_id, godown_id, date } = req.query;

    if (!company_id || !godown_id) {
      return res.status(400).json({ error: "company_id and godown_id required" });
    }

    // MAIN PURCHASE RECORDS
    const mainQuery = await pool.query(
      `
      SELECT 
        fr.id,
        fr.date,
        fr.company_id,
        fr.godown_id,
        fr.vendor_id,
        fr.total_amount,
        v.name AS vendor_name
      FROM feriwala_records fr
      LEFT JOIN vendors v ON v.id = fr.vendor_id
      WHERE fr.company_id = $1
        AND fr.godown_id = $2
        AND ($3::date IS NULL OR fr.date <= $3::date)
      ORDER BY fr.date DESC
      `,
      [company_id, godown_id, date || null]
    );

    const feriwalaRecords = mainQuery.rows;

    // LOAD SCRAPS FOR EACH PURCHASE
    for (const r of feriwalaRecords) {
      const scrapQuery = await pool.query(
        `
        SELECT 
          fs.material AS material_name,
          fs.weight,
          fs.rate,
          fs.amount
        FROM feriwala_scraps fs
        WHERE fs.feriwala_id = $1
        `,
        [r.id]
      );

      r.scraps = scrapQuery.rows;
    }

    return res.json({
      success: true,
      records: feriwalaRecords,
    });

  } catch (err) {
    console.error("❌ Feriwala GET /LIST Error:", err);
    return res.status(500).json({ error: "Failed to load records" });
  }
});


export default router;
