# STAFF — Stats

| Feature                  | Route        | Params                                       | Body | Response         |
| ------------------------ | ------------ | -------------------------------------------- | ---- | ---------------- |
| Get dashboard statistics | `GET /stats` | Query: `months?: integer` (3–24, default 12) | None | `StatsDashboard` |

`StatsDashboard` returns `generatedAt`, `period`, `kpis`, and charts for registrations, participation/review/venture trends, activity lifecycle, statuses, activity types, portfolios, and user roles.
