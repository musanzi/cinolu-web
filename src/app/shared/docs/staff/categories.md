# STAFF — Categories

| Feature         | Route                    | Params           | Body                               | Response   |
| --------------- | ------------------------ | ---------------- | ---------------------------------- | ---------- |
| Create category | `POST /categories`       | None             | `name: string` (1–100 characters)  | `Category` |
| Update category | `PATCH /categories/:id`  | Path: `id: UUID` | `name?: string` (1–100 characters) | `Category` |
| Delete category | `DELETE /categories/:id` | Path: `id: UUID` | None                               | `void`     |

`Category` contains the base entity fields and `name`.
