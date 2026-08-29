from collections.abc import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import verify_cognito_token
from app.db.session import SessionLocal
from app.models.user import User

bearer_scheme = HTTPBearer(auto_error=True)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    claims = verify_cognito_token(credentials.credentials)
    if claims is None:
        raise credentials_exception

    cognito_sub = claims.get("sub")
    email = claims.get("email")
    if not cognito_sub or not email:
        raise credentials_exception

    user = db.query(User).filter(User.cognito_sub == cognito_sub).first()
    if user is None:
        user = User(
            cognito_sub=cognito_sub,
            name=claims.get("name") or email.split("@")[0],
            email=email,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user
