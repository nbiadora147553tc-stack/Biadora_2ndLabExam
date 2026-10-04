# Biadora2nd_LabExam

## CCE106 Practical Laboratory Examination

## Student Service Portal

### Student Information

Name: Nazvil Biadora

Section: CCE 106 2063

Date: Oct 5 2026

### Required Features

- [ ] Login
- [ ] Authentication state
- [ ] Secure token storage
- [ ] Protected navigation
- [ ] Dashboard
- [ ] Student API request
- [ ] Loading state
- [ ] Error state
- [ ] Empty state
- [ ] Search/filter
- [ ] Dynamic student details
- [ ] Profile
- [ ] Session restoration
- [ ] Logout

### API

The Postman mock URL documented in `docs/api-notes.md` is configured in `constants/api.ts`.

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

The sign-in screen requires the credentials and matching login example configured
in the provided Postman mock. A successful login response must contain `access_token`
or `token`. The app rejects responses without a token and never stores the password.
Native sessions use Expo SecureStore. Web sessions remain in memory because SecureStore
is unavailable there.

Student records and profiles are loaded from the documented API endpoints. No sample
student data or credentials are included in the app.

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
