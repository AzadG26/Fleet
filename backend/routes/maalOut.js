import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/* -------------------------------
   ADD SALE (MAAL OUT)
-------------------------------- */
router.post("/add-sale", async (req, res) => {
  try {
    const {
      company_id,
      godown_id,
      firm_name,
      bill_to,
      date,
      weight,
      rate,
      gst,
      freight,
      vehicle_no,
      payment_type
    } = req.body;

    const amount = Number(weight) * Number(rate);

    const q = `
      INSERT INTO maal_out
      (id, company_id, godown_id, firm_name, bill_to, date, weight, rate, amount, gst, freight, vehicle_no, payment_type, created_at)
      VALUES (uuid_generate_v4(), $1,$2,$3,$4,$5::date,$6,$7,$8,$9,$10,$11,$12,NOW())
      RETURNING *;
    `;

    const result = await pool.query(q, [
      company_id, godown_id, firm_name, bill_to, date,
      weight, rate, amount, gst, freight, vehicle_no, payment_type
    ]);

    res.json({ success: true, sale: result.rows[0] });

  } catch (err) {
    console.error("MAAL OUT ADD ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* -------------------------------
   LIST SALES
-------------------------------- */
router.get("/list-sales", async (req, res) => {
  try {
    const { company_id, godown_id, date } = req.query;

    const params = [company_id, godown_id];
    let where = `company_id=$1 AND godown_id=$2`;

    if (date) {
      params.push(date);
      where += ` AND date=$${params.length}::date`;
    }

    const q = `
      SELECT * FROM maal_out
      WHERE ${where}
      ORDER BY date DESC, created_at DESC;
    `;

    const result = await pool.query(q, params);
    res.json({ success: true, sales: result.rows });

  } catch (err) {
    console.error("LIST SALES ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* -------------------------------
   ADD PAYMENT
-------------------------------- */
router.post("/add-payment", async (req, res) => {
  try {
    const { company_id, godown_id, firm_name, amount, date } = req.body;

    const q = `
      INSERT INTO maal_out_payments
      (id, company_id, godown_id, firm_name, amount, date, created_at)
      VALUES (uuid_generate_v4(), $1,$2,$3,$4,$5::date,NOW())
      RETURNING *;
    `;

    const result = await pool.query(q, [
      company_id, godown_id, firm_name, amount, date
    ]);

    res.json({ success: true, payment: result.rows[0] });

  } catch (err) {
    console.error("PAYMENT ADD ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* -------------------------------
   LIST PAYMENTS
-------------------------------- */
router.get("/list-payments", async (req, res) => {
  try {
    const { company_id, godown_id, date } = req.query;

    const params = [company_id, godown_id];
    let where = `company_id=$1 AND godown_id=$2`;

    if (date) {
      params.push(date);
      where += ` AND date=$${params.length}::date`;
    }

    const q = `
      SELECT * FROM maal_out_payments
      WHERE ${where}
      ORDER BY date DESC, created_at DESC;
    `;

    const rows = await pool.query(q, params);

    res.json({ success: true, payments: rows.rows });

  } catch (err) {
    console.error("LIST PAYMENTS ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
