# API notes

Base URL: `https://25e46116-162c-4759-93ee-7cae1985b1f8.mock.pstmn.io`

Responses below were observed with curl on 2026-10-04.

| Method and endpoint | HTTP status | Observed response fields |
| --- | --- | --- |
| `POST /login` | `400 Bad Request` | `error.name`, `error.message` (`badRequest`; `Request body has invalid format.`) |
| `GET /students` | `200 OK` | Array of student objects with `id`, `name`, `email`, `course`, `year`, `section` |
| `GET /students/1` | `200 OK` | `id`, `name`, `email`, `course`, `year`, `section`, `address`, `contact` |
| `GET /profile` | `200 OK` | `id`, `name`, `email`, `section` |

The login request was sent as JSON with `email` and `password`, using the supplied credentials. The mock returned the 400 error above, so no successful login response fields were observed.

The app sends `x-mock-match-request-body: true` on login. When no saved request
example matches the submitted body, Postman returns its generic no-match error;
the app displays a login-specific message telling the user to check credentials
and the saved `POST /login` example body. This mock response is not a server-side
credential validation result.

## Implementation assumptions

- The login request body is `{ "email": string, "password": string }`.
- On successful login, the token is expected as `access_token` or `token`, with an optional `user` or `profile` object. These success fields could not be verified because the mock rejected the request.
- The students endpoint returns a JSON array. Student `id`, `name`, and `email` are required; `course`, `year`, `section`, `address`, and `contact` are optional where available.
- The profile response contains `id`, `name`, `email`, and `section`; `role` is optional.
