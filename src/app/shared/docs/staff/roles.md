# STAFF — Roles

| Feature     | Route               | Params                                          | Body            | Response           |
| ----------- | ------------------- | ----------------------------------------------- | --------------- | ------------------ |
| Create role | `POST /roles`       | None                                            | `name: string`  | `Role`             |
| List roles  | `GET /roles`        | Query: `page?`, `limit?`, `take?`, `q?: string` | None            | `[Role[], number]` |
| Get role    | `GET /roles/:id`    | Path: `id: UUID`                                | None            | `Role`             |
| Update role | `PATCH /roles/:id`  | Path: `id: UUID`                                | `name?: string` | `Role`             |
| Delete role | `DELETE /roles/:id` | Path: `id: UUID`                                | None            | `void`             |

`Role` contains the base entity fields and `name`.
