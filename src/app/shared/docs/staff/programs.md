# STAFF — Programs

| Feature        | Route                     | Params           | Body                                                                                       | Response  |
| -------------- | ------------------------- | ---------------- | ------------------------------------------------------------------------------------------ | --------- |
| Create program | `POST /programs`          | None             | `name: string` (max 150), `description?: string`, `portfolioId: UUID`, `managers?: UUID[]` | `Program` |
| Upload logo    | `POST /programs/:id/logo` | Path: `id: UUID` | Multipart: `logo: file`                                                                    | `Program` |
| Update program | `PATCH /programs/:id`     | Path: `id: UUID` | Any create field, optional                                                                 | `Program` |
| Delete program | `DELETE /programs/:id`    | Path: `id: UUID` | None                                                                                       | `void`    |

`Program` contains the base entity fields plus `name`, `slug`, `description?`, `logo?`, `portfolio`, and `managers`.
