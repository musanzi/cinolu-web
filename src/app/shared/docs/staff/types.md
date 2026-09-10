# STAFF — Types

| Feature     | Route               | Params           | Body                               | Response |
| ----------- | ------------------- | ---------------- | ---------------------------------- | -------- |
| Create type | `POST /types`       | None             | `name: string` (1–100 characters)  | `Type`   |
| Update type | `PATCH /types/:id`  | Path: `id: UUID` | `name?: string` (1–100 characters) | `Type`   |
| Delete type | `DELETE /types/:id` | Path: `id: UUID` | None                               | `void`   |

`Type` contains the base entity fields and `name`.
