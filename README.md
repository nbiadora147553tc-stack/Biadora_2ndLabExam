# CCE106 Practical Laboratory Examination

## Student Service Portal

### Student Information

Name:Jhon Dave Ledesma

Section: CCE 106 2026

Date: Oct 3 2026

### Required Features

- [x] Login
- [x] Authentication state
- [x] Secure token storage
- [x] Protected navigation
- [x] Dashboard
- [x] Student API request
- [x] Loading state
- [x] Error state
- [x] Empty state
- [x] Search/filter
- [x] Dynamic student details
- [x] Profile
- [x] Session restoration
- [x] Logout

### API

Base URL: `https://25e46116-162c-4759-93ee-7cae1985b1f8.mock.pstmn.io` (set in `constants/api.ts`)

POST /login

GET /students

GET /students/{id}

GET /profile

Use the instructor's API documentation for payloads and response fields.

### How to Run

```sh
npm install
npx expo start
```

Press `w` for web, or run `npm run web` directly.

Sign in with the credentials supplied by the instructor. Login requests ask the
Postman mock to match the saved request body, so its `POST /login` example must
contain the valid email/password body and `Content-Type: application/json`.
Student list, details, and profile records load from the API rather than from
local sample data.

Expo SecureStore is used only in `context/AuthContext.tsx`; web sessions remain
in memory and do not survive reloads. Verify secure session restoration on
Android/iOS. See the [Expo SDK 54 SecureStore documentation](https://docs.expo.dev/versions/v54.0.0/sdk/securestore/).

Compiler and lint checks:

```sh
npx tsc --noEmit
npm run lint
```

### Required Git Commits

Students must create at least five meaningful commits.

Suggested examples:

- `exam: setup navigation`
- `exam: implement login`
- `exam: integrate student api`
- `exam: add dynamic student details`
- `exam: implement session and logout`

### Submission

Submit the GitHub repository URL according to the instructor's instructions.
