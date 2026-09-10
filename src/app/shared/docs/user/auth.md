# User — Auth

| Feature             | Route                         | Params | Body                                                                                             | Response                     |
| ------------------- | ----------------------------- | ------ | ------------------------------------------------------------------------------------------------ | ---------------------------- |
| Sign out            | `POST /auth/signout`          | None   | None                                                                                             | `void`; destroys the session |
| Get current profile | `GET /auth/me`                | None   | None                                                                                             | `UserResponse`               |
| Update profile      | `PATCH /auth/me/update`       | None   | `email?`, `name?`, `password?`, `avatar?`, `jobTitle?`, `socialLinks?: object`, `roles?: UUID[]` | `UserResponse`               |
| Update password     | `PATCH /auth/password/update` | None   | `password: string` (minimum 6 characters)                                                        | `UserResponse`               |

`UserResponse` contains the base entity fields plus `name`, `email`, `avatar`, `jobTitle?`, `biography`, `socialLinks`, and `roles: string[]`. Passwords are omitted. The current profile DTO permits `roles`; the controller does not remove it from self-update requests.
