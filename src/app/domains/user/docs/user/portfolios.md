# User — Portfolios

| Feature         | Route                 | Params                                          | Body | Response                |
| --------------- | --------------------- | ----------------------------------------------- | ---- | ----------------------- |
| List portfolios | `GET /portfolios`     | Query: `page?`, `limit?`, `take?`, `q?: string` | None | `[Portfolio[], number]` |
| Get portfolio   | `GET /portfolios/:id` | Path: `id: UUID`                                | None | `Portfolio`             |

`Portfolio` contains the base entity fields plus `name`, `slug`, `description?`, and `logo?`.
