# STAFF — Participations

| Feature                 | Route                              | Params                                                                                             | Body                                      | Response                    |
| ----------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------- |
| List all participations | `GET /participations/staff`        | Query: `page?`, `limit?`, `take?`, `activityId?: UUID`, `status?: pending \| approved \| declined` | None                                      | `[Participation[], number]` |
| Get participation       | `GET /participations/staff/:id`    | Path: `id: UUID`                                                                                   | None                                      | `Participation`             |
| Update status           | `PATCH /participations/:id/status` | Path: `id: UUID`                                                                                   | `status: pending \| approved \| declined` | `Participation`             |

`Participation` contains the base entity fields plus `participant`, `activity`, `data: object`, and `status`.
