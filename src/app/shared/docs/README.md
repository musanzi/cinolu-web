# API feature reference

Features are grouped by effective route access, then by module:

- [STAFF features](#staff-features)
- [User features](#user-features)
- [Guest features](#guest-features)

## Access conventions

- **STAFF** — authenticated session with the `staff` role; these routes use `@HasRoles([Roles.STAFF])`.
- **User** — any authenticated session; STAFF users can also call these routes.
- **Guest** — no authenticated session required; these routes use `@Public()`.

Authentication is cookie/session based. Unless stated otherwise, request and response content is JSON.

`UUID` means UUID v4. `DateTime` means an ISO-8601 date-time. Every entity contains `id`, `createdAt`, `updatedAt`, and `deletedAt`. Paginated responses use `[items, total]`. Common pagination query parameters are `page?`, `limit?`, and `take?`.

## STAFF features

- [Activities](./staff/activities.md)
- [Categories](./staff/categories.md)
- [Participations](./staff/participations.md)
- [Portfolios](./staff/portfolios.md)
- [Programs](./staff/programs.md)
- [Reviews](./staff/reviews.md)
- [Roles](./staff/roles.md)
- [Sectors](./staff/sectors.md)
- [Stats](./staff/stats.md)
- [Types](./staff/types.md)
- [Users](./staff/users.md)
- [Ventures](./staff/ventures.md)

## User features

- [Auth](./user/auth.md)
- [Categories](./user/categories.md)
- [Participations](./user/participations.md)
- [Portfolios](./user/portfolios.md)
- [Programs](./user/programs.md)
- [Reviews](./user/reviews.md)
- [Sectors](./user/sectors.md)
- [Types](./user/types.md)
- [Users](./user/users.md)
- [Ventures](./user/ventures.md)

## Guest features

- [Activities](./guest/activities.md)
- [Auth](./guest/auth.md)
