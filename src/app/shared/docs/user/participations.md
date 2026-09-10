# User — Participations

| Feature                 | Route                          | Params                                                                                             | Body                                   | Response                                          |
| ----------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------- |
| Apply to activity       | `POST /participations`         | None                                                                                               | `activityId: UUID`, `data: JSONString` | `Participation`                                   |
| List my participations  | `GET /participations/mine`     | Query: `page?`, `limit?`, `take?`, `activityId?: UUID`, `status?: pending \| approved \| declined` | None                                   | `[Participation[], number]`                       |
| Get my participation    | `GET /participations/mine/:id` | Path: `id: UUID`                                                                                   | None                                   | `Participation`; ownership enforced               |
| Update my participation | `PATCH /participations/:id`    | Path: `id: UUID`                                                                                   | `data: JSONString`                     | `Participation`; ownership enforced; pending only |

`Participation` contains the base entity fields plus `participant`, `activity`, `data: object`, and `status`. The DTO uses `@IsJSON()`, so request `data` currently must be a JSON-encoded string. A user can participate only once per activity.
