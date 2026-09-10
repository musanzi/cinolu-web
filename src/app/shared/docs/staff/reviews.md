# STAFF — Reviews

| Feature          | Route                    | Params                                                 | Body | Response             |
| ---------------- | ------------------------ | ------------------------------------------------------ | ---- | -------------------- |
| List all reviews | `GET /reviews/staff`     | Query: `page?`, `limit?`, `take?`, `activityId?: UUID` | None | `[Review[], number]` |
| Get review       | `GET /reviews/staff/:id` | Path: `id: UUID`                                       | None | `Review`             |

`Review` contains the base entity fields plus `reviewer`, `activity`, and `data`.
