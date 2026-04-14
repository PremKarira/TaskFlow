-- USERS
INSERT INTO users (id, name, email, password, created_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Test User',
  'test@example.com',
  '$2b$12$0G9xvUp4XNVGqrGJTjbFduh75.XJb6E5HrPkELGfP0gYvlLYBTBge', -- password: password123
  now()
);

-- PROJECT
INSERT INTO projects (id, name, description, owner_id, created_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Demo Project #1',
  'Test project',
  '11111111-1111-1111-1111-111111111111',
  now()
);

-- TASKS
INSERT INTO tasks (
  id, title, description, status, priority,
  project_id, assignee_id, due_date, created_at, updated_at
) VALUES
(
  '33333333-3333-3333-3333-333333333333',
  'Task 1',
  null,
  'todo',
  'low',
  '22222222-2222-2222-2222-222222222222',
  null,
  null,
  now(),
  now()
),
(
  '44444444-4444-4444-4444-444444444444',
  'Task 2',
  null,
  'in_progress',
  'medium',
  '22222222-2222-2222-2222-222222222222',
  null,
  null,
  now(),
  now()
),
(
  '55555555-5555-5555-5555-555555555555',
  'Task 3',
  null,
  'done',
  'high',
  '22222222-2222-2222-2222-222222222222',
  null,
  null,
  now(),
  now()
);