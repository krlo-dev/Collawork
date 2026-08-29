import requests
from jose import jwt
from jose.exceptions import JWTError

from app.core.config import settings

_jwks_cache: dict | None = None


def _cognito_issuer() -> str:
    return f"https://cognito-idp.{settings.aws_region}.amazonaws.com/{settings.cognito_user_pool_id}"


def _get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache is None:
        url = f"{_cognito_issuer()}/.well-known/jwks.json"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        _jwks_cache = response.json()
    return _jwks_cache


def verify_cognito_token(token: str) -> dict | None:
    """Verify a Cognito ID token and return its claims, or None if invalid."""
    try:
        unverified_headers = jwt.get_unverified_header(token)
        kid = unverified_headers.get("kid")
        key = next((k for k in _get_jwks()["keys"] if k["kid"] == kid), None)
        if key is None:
            return None

        return jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=settings.cognito_app_client_id,
            issuer=_cognito_issuer(),
        )
    except (JWTError, requests.RequestException, KeyError):
        return None
