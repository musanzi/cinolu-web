# User — Programs

| Feature                | Route                           | Params                                                                                    | Body | Response              |
| ---------------------- | ------------------------------- | ----------------------------------------------------------------------------------------- | ---- | --------------------- |
| List programs          | `GET /programs`                 | Query: `page?`, `limit?`, `take?`, `q?: string`, `portfolioId?: UUID`, `managerId?: UUID` | None | `[Program[], number]` |
| List by portfolio slug | `GET /programs/portfolio/:slug` | Path: `slug: string`                                                                      | None | `Program[]`           |
| Get program            | `GET /programs/:id`             | Path: `id: UUID`                                                                          | None | `Program`             |

`Program` contains the base entity fields plus `name`, `slug`, `description?`, `logo?`, `portfolio`, and `managers`.
