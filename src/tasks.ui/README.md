# Task Management Frontend

A responsive, component-driven React application for managing project tasks. This frontend features optimistic UI updates, local inline form validation schemas, and real-time cache management.

## Tech Stack

*   **Framework:** React (TypeScript)
*   **State Management & Data Fetching:** TanStack Query

---

## Project Architecture (Bulletproof)

```text
src/
├── config/          # API environment configurations
├── features/        # Domain-driven feature modules
│   └── tasks/
│       ├── api/         # Axios/Fetch API mutation and query requests
│       ├── components/  # Task cards, forms, and filters
│       ├── hooks/       # Custom TanStack Query mutations (Optimistic updates)
│       └── types/       # TypeScript models and status enums
├── App.tsx          # Application shell and context provider mounting
└── main.tsx         # Application entry point
```

## Setup & Run

### Prerequisite
Ensure you have Node.js installed

### 1. Install Dependencies
Clone the repository and install the node package modules from your project root:

```bash
npm install
```

### 2. Build Application
```bash
npm run build
```

### 3. Run Application
```bash
npm run dev
```