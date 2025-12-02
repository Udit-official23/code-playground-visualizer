# API Reference – Code Playground & Algorithm Visualizer

This document describes the backend API surface of the project.  
All routes are implemented as **Next.js App Router** handlers under `src/app/api/*`.

---

## Base URL

When running locally:

- **Base URL:** `http://localhost:3000`

When deployed to production, the base URL will depend on the hosting platform (e.g. Vercel, custom Node server, etc.).

---

## Common Concepts

### Request & Response Format

- All endpoints use **JSON** request and response bodies.
- All endpoints are designed to be **stateless**.
- Errors return:
  - A non-2xx HTTP status code
  - A JSON payload with an `error` field

Example error:

```json
{
  "error": "Invalid payload: code is required."
}
