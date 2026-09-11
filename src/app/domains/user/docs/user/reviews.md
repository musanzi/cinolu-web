# User — Reviews

| Feature          | Route                   | Params                                                 | Body                                | Response                                  |
| ---------------- | ----------------------- | ------------------------------------------------------ | ----------------------------------- | ----------------------------------------- |
| Create review    | `POST /reviews`         | None                                                   | `activityId: UUID`, `data: unknown` | `Review`; approved participation required |
| List my reviews  | `GET /reviews/mine`     | Query: `page?`, `limit?`, `take?`, `activityId?: UUID` | None                                | `[Review[], number]`                      |
| Get my review    | `GET /reviews/mine/:id` | Path: `id: UUID`                                       | None                                | `Review`; ownership enforced              |
| Update my review | `PATCH /reviews/:id`    | Path: `id: UUID`                                       | `data: unknown`                     | `Review`; ownership enforced              |

`Review` contains the base entity fields plus `reviewer`, `activity`, and `data`. A user can submit only one review per activity.
