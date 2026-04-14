import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      error: "validation failed",
      fields: { name: "required", email: "required", password: "required" }
    });
  }

  const hash = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `INSERT INTO users (id,name,email,password,created_at)
     VALUES ($1,$2,$3,$4,now()) RETURNING id,email,name`,
    [uuidv4(), name, email, hash]
  );

  const token = jwt.sign(
    { user_id: result.rows[0].id, email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.status(201).json({ token, user: result.rows[0] });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length)
    return res.status(401).json({ error: "unauthorized" });

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid)
    return res.status(401).json({ error: "unauthorized" });

  const token = jwt.sign(
    { user_id: user.rows[0].id, email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({ token });
});

export default router;