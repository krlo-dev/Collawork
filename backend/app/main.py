from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import discovery, profiles, uploads
from app.core.config import settings

app = FastAPI(title="Collawork API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profiles.router)
app.include_router(discovery.router)
app.include_router(uploads.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
