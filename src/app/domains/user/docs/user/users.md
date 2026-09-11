# User — Users

| Feature            | Route                        | Params | Body                      | Response         |
| ------------------ | ---------------------------- | ------ | ------------------------- | ---------------- |
| List staff members | `GET /users/staff`           | None   | None                      | `UserResponse[]` |
| List mentors       | `GET /users/mentors`         | None   | None                      | `UserResponse[]` |
| Upload my avatar   | `POST /users/profile/avatar` | None   | Multipart: `avatar: file` | `UserResponse`   |

`UserResponse` contains the base entity fields plus `name`, `email`, `avatar`, `jobTitle?`, `biography`, `socialLinks`, and `roles: string[]`. Passwords are omitted.
