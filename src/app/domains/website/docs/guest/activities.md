# Guest — Activities

| Feature                        | Route                    | Params                                                                                        | Body | Response                 |
| ------------------------------ | ------------------------ | --------------------------------------------------------------------------------------------- | ---- | ------------------------ |
| List published activities      | `GET /activities`        | Query: `page?`, `limit?`, `take?`, `q?: string`, `startDate?: DateTime`, `endDate?: DateTime` | None | `[Activity[], number]`   |
| List recent ongoing activities | `GET /activities/recent` | None                                                                                          | None | `Activity[]` (maximum 5) |
| Get published activity by slug | `GET /activities/:slug`  | Path: `slug: string`                                                                          | None | `Activity`               |

`Activity` includes its base entity fields plus `name`, `slug`, `description?`, `startDate`, `endDate`, `participationForm`, `isPublished`, `reviewForm`, `cover?`, `program`, `mentors`, `types`, and `categories`.
