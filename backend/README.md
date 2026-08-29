# Collawork API (Phase 1)

FastAPI backend for Collawork. Phase 1 scope: local app only (no AWS yet — see `PRD-collawork.md`).

Auth is a local email/password + JWT implementation for now; it will be replaced by Amazon Cognito in Phase 2.

## Setup

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env   # adjust DATABASE_URL if needed
```

A local Postgres instance is expected at the URL in `.env`. For local dev without a native Postgres install:

```bash
docker run -d --name collawork-db \
  -e POSTGRES_USER=collawork -e POSTGRES_PASSWORD=collawork -e POSTGRES_DB=collawork \
  -p 5433:5432 -v collawork-db-data:/var/lib/postgresql/data postgres:16
```

## Migrations

```bash
.venv/bin/alembic upgrade head
```

## Run

```bash
.venv/bin/uvicorn app.main:app --reload --port 8000
```

Docs at http://localhost:8000/docs.

## Endpoints

- `POST /auth/register`, `POST /auth/login` — email/password auth, returns a JWT
- `GET /users/me`, `PUT /users/me`, `DELETE /users/me` — own profile (skills, bio, location, media URLs)
- `GET /users/{id}` — public profile
- `GET /discovery?skill=&location=&q=` — search/filter profiles
