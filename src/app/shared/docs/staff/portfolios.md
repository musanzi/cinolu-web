# STAFF — Portfolios

| Feature          | Route                       | Params           | Body                                             | Response    |
| ---------------- | --------------------------- | ---------------- | ------------------------------------------------ | ----------- |
| Create portfolio | `POST /portfolios`          | None             | `name: string` (max 150), `description?: string` | `Portfolio` |
| Upload logo      | `POST /portfolios/:id/logo` | Path: `id: UUID` | Multipart: `logo: file`                          | `Portfolio` |
| Update portfolio | `PATCH /portfolios/:id`     | Path: `id: UUID` | `name?: string`, `description?: string`          | `Portfolio` |
| Delete portfolio | `DELETE /portfolios/:id`    | Path: `id: UUID` | None                                             | `void`      |

`Portfolio` contains the base entity fields plus `name`, `slug`, `description?`, and `logo?`.
