# User — Types

| Feature    | Route            | Params                                          | Body | Response           |
| ---------- | ---------------- | ----------------------------------------------- | ---- | ------------------ |
| List types | `GET /types`     | Query: `page?`, `limit?`, `take?`, `q?: string` | None | `[Type[], number]` |
| Get type   | `GET /types/:id` | Path: `id: UUID`                                | None | `Type`             |

`Type` contains the base entity fields and `name`.
