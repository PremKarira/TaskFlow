import express from "express";
import { pool } from "../config/db.js";
import { auth } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET projects
router.get("/", auth, async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM projects WHERE owner_id=$1`,
    [req.user.user_id]
  );

  res.json({ projects: result.rows });
});

// CREATE project
router.post("/", auth, async (req, res) => {
  const { name, description } = req.body;

  const result = await pool.query(
    `INSERT INTO projects (id,name,description,owner_id,created_at)
     VALUES ($1,$2,$3,$4,now()) RETURNING *`,
    [uuidv4(), name, description, req.user.user_id]
  );

  res.status(201).json(result.rows[0]);
});

// GET project with tasks
router.get("/:id", auth, async (req, res) => {
  const project = await pool.query(
    `SELECT * FROM projects WHERE id=$1`,
    [req.params.id]
  );

  if (!project.rows.length)
    return res.status(404).json({ error: "not found" });

  const tasks = await pool.query(
    `SELECT * FROM tasks WHERE project_id=$1`,
    [req.params.id]
  );

  res.json({ ...project.rows[0], tasks: tasks.rows });
});

// PATCH project (owner only)
router.patch("/:id", auth, async (req, res) => {
  const check = await pool.query(
    "SELECT owner_id FROM projects WHERE id=$1",
    [req.params.id]
  );

  if (!check.rows.length)
    return res.status(404).json({ error: "not found" });

  if (check.rows[0].owner_id !== req.user.user_id)
    return res.status(403).json({ error: "forbidden" });

  const { name, description } = req.body;

  const result = await pool.query(
    `UPDATE projects SET name=$1, description=$2 WHERE id=$3 RETURNING *`,
    [name, description, req.params.id]
  );

  res.json(result.rows[0]);
});

// DELETE project (owner only)
router.delete("/:id", auth, async (req, res) => {
  const check = await pool.query(
    "SELECT owner_id FROM projects WHERE id=$1",
    [req.params.id]
  );

  if (!check.rows.length)
    return res.status(404).json({ error: "not found" });

  if (check.rows[0].owner_id !== req.user.user_id)
    return res.status(403).json({ error: "forbidden" });

  await pool.query("DELETE FROM tasks WHERE project_id=$1", [req.params.id]);
  await pool.query("DELETE FROM projects WHERE id=$1", [req.params.id]);

  res.status(204).send();
});

export default router;