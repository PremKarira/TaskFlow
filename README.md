# TaskFlow — Full Stack Task Management System

## 1. Overview

TaskFlow is a lightweight full-stack task management system that allows users to:

* Register and login securely
* Create and manage projects
* Create tasks inside projects
* Update task status (todo → in_progress → done)
* Assign and manage tasks
* Delete tasks and projects

It is built as a production-style CRUD system with authentication, relational data modeling, and containerized deployment.

---

## 2. Tech Stack

### Backend

* Node.js (Express)
* PostgreSQL
* JWT Authentication
* bcrypt password hashing
* pg (raw SQL queries)

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript (SPA approach)

### Infrastructure

* Docker
* Docker Compose
* PostgreSQL container

---

## 3. Architecture Decisions

### Backend Design

* Built using Express for simplicity and control
* Stateless authentication using JWT
* Passwords hashed using bcrypt (cost factor 12)
* PostgreSQL used for relational consistency (User → Project → Task)
* Direct SQL queries used instead of ORM for full control and transparency

### Frontend Design

* Built as a **Single Page Application (SPA)** using vanilla JavaScript
* No framework used to keep the app lightweight and dependency-free
* View switching handled manually instead of routing libraries
* Kanban-style UI for task visualization

### Database Design

* Fully relational schema:

  * Users own Projects
  * Projects contain Tasks
* Foreign key relationships ensure data integrity

### Key Tradeoffs

* No ORM → more control, but more manual query handling
* No React → faster setup, but less scalable UI architecture
* Minimal frontend validation → backend is source of truth

---

## 4. Running Locally

### Prerequisites

* Docker & Docker Compose installed

---

### Setup Steps

```bash
git clone https://github.com/PremKarira/TaskFlow
cd taskflow

cp .env.example .env

docker compose up --build
```

---

### Application URLs

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:8080](http://localhost:8080)

---

## 5. Environment Variables

Create a `.env` file:

```
POSTGRES_DB=taskflow
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

DATABASE_URL=postgres://postgres:postgres@db:5432/taskflow

JWT_SECRET=supersecret

PORT=8080
RUN_SEED=true
```

---

## 6. Database & Migrations

* Database schema is managed using SQL migrations (or initialization scripts)
* Tables are created automatically on container startup
* Seed data is included for testing

### Seed Data Includes:

* 1 test user
* 1 sample project
* 3 sample tasks

---

## 7. Test Credentials

```
Email: test@example.com
Password: password123
```

---

## 8. API Reference

### Authentication

#### POST /auth/register

Registers a new user.

```
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

```
Response:
{
  "token": "<jwt>",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### POST /auth/login

```
Request:
{
  "email": "john@example.com",
  "password": "secret123"
}
```

```
Response:
{
  "token": "<jwt>"
}
```

---

### Projects

All project endpoints require:

```
Authorization: Bearer <token>
```

---

#### GET /projects

Returns all projects owned by the user.

---

#### POST /projects

```
{
  "name": "My Project",
  "description": "Optional description"
}
```

---

#### GET /projects/:id

Returns project details with tasks.

---

#### PATCH /projects/:id

Updates project (owner only).

```
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

---

#### DELETE /projects/:id

Deletes project and all its tasks (owner only).

---

### Tasks

#### GET /tasks/project/:id

Query parameters:

* status (optional)
* assignee (optional)

---

#### POST /tasks/project/:id

```
{
  "title": "Build API",
  "priority": "high",
  "description": "optional"
}
```

---

#### PATCH /tasks/:id

Supports partial updates:

```
{
  "title": "Updated title",
  "status": "done",
  "priority": "low",
  "assignee_id": "uuid",
  "due_date": "2026-04-20"
}
```

---

#### DELETE /tasks/:id

Deletes a task.

---

## 9. Features Implemented

### Core Features

* JWT authentication system
* Project creation and management
* Task CRUD operations
* Kanban-style task board
* SPA frontend (no reload navigation)
* PostgreSQL relational schema
* Dockerized full-stack setup

### Security

* Password hashing using bcrypt
* JWT-based authentication
* Protected routes using middleware

---

## 10. Design Tradeoffs

* No ORM used → better SQL control, but more manual queries
* Vanilla JS frontend → faster build, but limited scalability
* Minimal frontend validation → backend handles all validation
* No real-time updates → avoided WebSocket complexity for scope control

---

## 11. Future Improvements

* Add drag-and-drop task management
* Add role-based access control (RBAC)
* Improve frontend routing using React
* Add pagination and filtering on all list endpoints
* Add proper migration tool (golang-migrate / dbmate integration)
* Add unit + integration tests

---

## 12. How to Run (Production Style)

```
docker compose up --build
```

