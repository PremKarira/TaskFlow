import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { execSync } from "child_process";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

const runSetup = () => {
  try {
    console.log("Running migrations...");

    // run dbmate migrations
    execSync("npx dbmate up", {
      stdio: "inherit",
      env: process.env
    });

    console.log("Migrations completed");

    // run seed ONLY on fresh start (safe approach via env flag)
    if (process.env.RUN_SEED === "true") {
      console.log("Running seed...");
      execSync("psql $DATABASE_URL -f seed.sql", {
        stdio: "inherit",
        env: process.env
      });
      console.log("Seed completed");
    }

  } catch (err) {
    console.error("Setup failed:", err.message);
    process.exit(1);
  }
};

runSetup();

app.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log("Server running");
});