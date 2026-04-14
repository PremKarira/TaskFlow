-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  status TEXT,
  priority TEXT,
  project_id UUID REFERENCES projects(id),
  assignee_id UUID,
  due_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- migrate:down
DROP TABLE tasks;
DROP TABLE projects;
DROP TABLE users;