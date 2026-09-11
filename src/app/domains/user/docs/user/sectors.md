# User — Sectors

| Feature      | Route              | Params                                          | Body | Response             |
| ------------ | ------------------ | ----------------------------------------------- | ---- | -------------------- |
| List sectors | `GET /sectors`     | Query: `page?`, `limit?`, `take?`, `q?: string` | None | `[Sector[], number]` |
| Get sector   | `GET /sectors/:id` | Path: `id: UUID`                                | None | `Sector`             |

`Sector` contains the base entity fields and `name`.
