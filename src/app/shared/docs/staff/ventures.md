# STAFF — Ventures

| Feature           | Route                     | Params                                                                                                               | Body | Response              |
| ----------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---- | --------------------- |
| List all ventures | `GET /ventures/staff`     | Query: `page?`, `limit?`, `take?`, `q?: string`, `sectorId?: UUID`, `stage?: VentureStage`, `status?: VentureStatus` | None | `[Venture[], number]` |
| Get venture       | `GET /ventures/staff/:id` | Path: `id: UUID`                                                                                                     | None | `Venture`             |

`VentureStage` is `idea | mvp | early_stage | growth | mature`. `VentureStatus` is `pending | approved | rejected`. `Venture` contains the base entity fields plus `name`, `slug`, `logo?`, `cover?`, `description`, `socials`, `owner`, `stage`, `status`, and `sectors`.

No STAFF venture-status update route is currently exposed, although an unused status DTO exists.
