# Collawork API (Phase 2)

FastAPI backend for Collawork. Phase 2 scope: real AWS integration for auth and media storage — see `PRD-collawork.md`.

Auth is handled by Amazon Cognito. The frontend authenticates directly against Cognito (via `amazon-cognito-identity-js`) and sends the resulting ID token as a Bearer token; the API verifies it against Cognito's JWKS on every request (see `app/core/security.py`). There is no local email/password login anymore.

## Setup

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env   # set DATABASE_URL, AWS_REGION, S3_BUCKET_NAME, COGNITO_USER_POOL_ID, COGNITO_APP_CLIENT_ID
```

A local Postgres instance is expected at the URL in `.env`. For local dev without a native Postgres install:

```bash
docker run -d --name collawork-db \
  -e POSTGRES_USER=collawork -e POSTGRES_PASSWORD=collawork -e POSTGRES_DB=collawork \
  -p 5433:5432 -v collawork-db-data:/var/lib/postgresql/data postgres:16
```

You'll also need a Cognito User Pool + App Client and an S3 bucket, with their IDs set in `.env`.

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

- `GET /users/me`, `PUT /users/me`, `DELETE /users/me` — own profile (skills, bio, location, media URLs); requires a valid Cognito Bearer token
- `GET /users/{id}` — public profile
- `GET /discovery?skill=&location=&q=` — search/filter profiles
- `POST /uploads/presign` — get a presigned S3 URL to upload an avatar or banner image
