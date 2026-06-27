# Simple Task Manager MVP

A simple task management engine.

## 1. Quick Start

### Backend (Port 5001)
1. Navigate to the solution root
2. Build the container `docker compose build --no-cache`
3. Run the container `docker compose up`
1. Navigate to `http://localhost:5001/swagger`

*Note: A persistent local SQLite database file (`tasks.db`) will automatically initialize and apply schema configurations in the project directory upon launch.*

#### Using the API
This MVP supports three test users. Their credentials are:

Username | Password
--- | ---
string | string
UserA | passwordA
UserB | passwordB

Users must obtain a `Bearer token` via the `/auth/login` endpoint

### Frontend (Port 5173)
1. Navigate to `src/tasks-ui`
2. Execute: `npm install && npm run dev`

---

## 2. Intentionally Scoped Features & Guardrails

* Tasks can be created, updated via inline forms, filtered by status tabs, and deleted.
* Basic input validation
* Simple user profile simulation is executed using an `X-User-Id` application context. Every database operation is scoped behind this boundary, guaranteeing User A cannot read, edit, or delete any item belonging to User B.
* Soft-deleting tasks until required to hard-delete

---

## 3. Explicit Architecture Omissions

* **Local Network Transport (HTTP vs. HTTPS):** The local Docker environment intentionally routes traffic over plain HTTP (`http://localhost:5001`).
* **Identity Management:** Fully integrated third-party identity authentication was omitted to focus on structural validation and end-to-end functionality within the timeframe.
* **Elaborate Architecture Layers (CQRS/MediatR/Repositories):** This application utilizes a single API project structure where Minimal API endpoints route straight into the Entity Framework database context. Splitting this into multiple abstraction projects for four endpoints would represent a misalignment of architectural complexity to the scope of this request.

---

## 4. Engineering Backlog

1. **Transactional Domain Events:** Implement an outbox table within the SQLite database to capture state changes, preparing the app to dispatch events asynchronously to an external system.
2. **Optimistic Concurrency Resolution:** Add a version row index to the task table to ensure web application changes gracefully catch and warn users if two browser windows modify an entity simultaneously.
3. **Frontend Polish** Proper UI and UX must be implemented

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

### 3. CMD vs IDE
An issue can arise when switching between using the Visual Studio build profile `Docker Compose` versus running the commandline `docker compose up`.
The two different methods can collide with running the EF migration, resulting in a `table exists` error.
* **Resolution:** Clear the Docker build cache to force a clean file restore:
  ```bash
  docker builder prune -f
  docker compose up --build
  ```
  Or stick with one or the other; don't switch between them until this is resolved.

### 4. Bearer token
When authenticating using the Swagger UI, ensure `Bearer` is supplied with your token. Otherwise you will get `401: Unauthorized` errors, even with a valid token.