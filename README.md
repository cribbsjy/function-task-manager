# Simple Task Manager MVP

A simple task management engine.

## 1. Quick Start

### Backend (Port 5001)
1. Navigate to the solution root
2. Run `docker compose up --build`

*Note: A persistent local SQLite database file (`tasks.db`) will automatically initialize and apply schema configurations in the project directory upon launch.*

### Frontend (Port 5173)
1. Navigate to `src/tasks-ui`
2. Execute: `npm install && npm run dev`

---

## 2. Intentionally Scoped Features & Guardrails

* Tasks can be created, updated via inline forms, filtered by status tabs, and deleted.
* Basic input validation
* Simple user profile simulation is executed using an `X-User-Id` application context. Every database operation is scoped behind this boundary, guaranteeing User A cannot read, edit, or delete any item belonging to User B.

---

## 3. Explicit Architecture Omissions (What was Left Out)

* **Local Network Transport (HTTP vs. HTTPS):** The local Docker environment intentionally routes traffic over plain HTTP (`http://localhost:5001`).
* **Identity Management:** Fully integrated third-party identity authentication was omitted to focus on structural validation and end-to-end functionality within the timeframe. User context tracking relies on structural request identification.
* **Elaborate Architecture Layers (CQRS/MediatR/Repositories):** This application utilizes a single API project structure where Minimal API endpoints route straight into the Entity Framework database context. Splitting this into multiple abstraction projects for four endpoints would represent a misalignment of architectural complexity to the scope of this request.

---

## 4. Engineering Backlog (What I would do with another day)

1. **Transactional Domain Events:** Implement an outbox table within the SQLite database to capture state changes, preparing the app to dispatch events asynchronously to an external system.
2. **Optimistic Concurrency Resolution:** Add a version row index to the task table to ensure web application changes gracefully catch and warn users if two browser windows modify an entity simultaneously.
3. **Transport Layer Security (TLS/HTTPS):**

---

## 5. Known Issues
1. The `SQLitePCLRaw` package may throw a vulnerability warning. This is a known local development artifact and has no impact on the application's isolated runtime footprint.

---

## Troubleshooting & Local Gotchas

### 1. Changes to NuGet Packages / Dependencies Not Reflecting in Docker
Docker aggressively caches layer states during the multi-stage build process. If you add or update NuGet packages locally and notice compilation errors during `docker compose up` indicating missing namespaces:

* **Example:** `error CS0234: The type or namespace name 'EntityFrameworkCore' does not exist...`
* **Resolution:** Clear the Docker build cache to force a clean file restore:
  ```bash
  docker builder prune -f
  docker compose up --build
  ```

### 2. Port Collisions
The API gateway binds to host port 5001. If you have a local instance of another application or IIS running on port 5001, you can modify the host port mapping in the docker-compose.yml file under the tasks-api service ports mapping.