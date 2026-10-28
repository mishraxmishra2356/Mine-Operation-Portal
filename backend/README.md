# MineSafe backend (Node + Express + SQLite)

```
npm install
copy .env.example .env     (Windows; use cp on Mac/Linux)
npm run dev                -> http://localhost:4000/api/health
```

First run creates `mine.db` and seeds demo data (not in production).
Demo logins (password `Demo@12345`): admin@mine.com, supervisor@mine.com, operator@mine.com

## API (all except login/health need a logged-in session cookie)
- POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
- GET  /api/dashboard/summary
- GET  /api/production/benches
- GET  /api/equipment, PATCH /api/equipment/:id  (admin, supervisor)
- GET  /api/hazards, POST /api/hazards, PATCH /api/hazards/:id  (admin, supervisor, safety_officer)

## Before real use
Set a long random JWT_SECRET, run with NODE_ENV=production behind HTTPS, change/remove demo users.
