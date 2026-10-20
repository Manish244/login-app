# Login App — Angular + Python (Flask)

```
backend/    Flask REST API (login, logout, me)
frontend/   Angular 19 app (login page + protected home page)
```

## Run the backend (port 5000)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Run the frontend (port 4200)

```bash
cd frontend
npm install
npm start
```

Open http://localhost:4200. `npm start` uses `proxy.conf.json` to forward `/api/*` to the Flask server.

Demo users: `admin` / `admin123`, `manish` / `password@1`

## API

| Method | Path          | Body / Header                         | Result                         |
|--------|---------------|---------------------------------------|--------------------------------|
| POST   | `/api/login`  | `{ "loginId": "...", "password": "..." }` | `200 { token, user }` or `401` |
| GET    | `/api/me`     | `Authorization: Bearer <token>`       | current user or `401`          |
| POST   | `/api/logout` | `Authorization: Bearer <token>`       | invalidates the token          |
