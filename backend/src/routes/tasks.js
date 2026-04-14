import express from "express";
import { pool } from "../config/db.js";
import { auth } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET /projects/:id/tasks
router.get("/project/:id", auth, async (req, res) => {
  const { status, assignee } = req.query;

  let query = "SELECT * FROM tasks WHERE project_id=$1";
  let values = [req.params.id];

  if (status) {
    query += " AND status=$2";
    values.push(status);
  }

  if (assignee) {
    query += ` AND assignee_id=$${values.length + 1}`;
    values.push(assignee);
  }

  const result = await pool.query(query, values);
  res.json({ tasks: result.rows });
});

// CREATE task
router.post("/project/:id", auth, async (req, res) => {
  const { title, priority } = req.body;

  const result = await pool.query(
    `INSERT INTO tasks
     (id,title,description,status,priority,project_id,assignee_id,due_date,created_at,updated_at)
     VALUES ($1,$2,null,'todo',$3,$4,null,null,now(),now())
     RETURNING *`,
    [uuidv4(), title, priority, req.params.id]
  );

  res.status(201).json(result.rows[0]);
});

// PATCH task (full update)
router.patch("/:id", auth, async (req, res) => {
  const { title, description, status, priority, assignee_id, due_date } = req.body;

  const result = await pool.query(
    `UPDATE tasks SET
      title=COALESCE($1,title),
      description=COALESCE($2,description),
      status=COALESCE($3,status),
      priority=COALESCE($4,priority),
      assignee_id=COALESCE($5,assignee_id),
      due_date=COALESCE($6,due_date),
      updated_at=now()
     WHERE id=$7 RETURNING *`,
    [title, description, status, priority, assignee_id, due_date, req.params.id]
  );

  res.json(result.rows[0]);
});

// DELETE task (basic version)
router.delete("/:id", auth, async (req, res) => {
  await pool.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);
  res.status(204).send();
});

export default router;