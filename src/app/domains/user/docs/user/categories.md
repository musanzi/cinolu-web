# User — Categories

| Feature         | Route                 | Params                                          | Body | Response               |
| --------------- | --------------------- | ----------------------------------------------- | ---- | ---------------------- |
| List categories | `GET /categories`     | Query: `page?`, `limit?`, `take?`, `q?: string` | None | `[Category[], number]` |
| Get category    | `GET /categories/:id` | Path: `id: UUID`                                | None | `Category`             |

`Category` contains the base entity fields and `name`.
