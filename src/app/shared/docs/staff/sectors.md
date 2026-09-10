# STAFF — Sectors

| Feature       | Route                 | Params           | Body                               | Response |
| ------------- | --------------------- | ---------------- | ---------------------------------- | -------- |
| Create sector | `POST /sectors`       | None             | `name: string` (1–100 characters)  | `Sector` |
| Update sector | `PATCH /sectors/:id`  | Path: `id: UUID` | `name?: string` (1–100 characters) | `Sector` |
| Delete sector | `DELETE /sectors/:id` | Path: `id: UUID` | None                               | `void`   |

`Sector` contains the base entity fields and `name`.
