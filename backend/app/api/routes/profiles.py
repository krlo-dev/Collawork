from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.profile_media import ProfileMedia
from app.models.skill import Skill, UserSkill
from app.models.user import User
from app.schemas.user import ProfileUpdateRequest, UserOut

router = APIRouter(tags=["profiles"])


@router.get("/users/me", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.from_model(current_user)


@router.get("/users/{user_id}", response_model=UserOut)
def get_public_profile(user_id: int, db: Session = Depends(get_db)) -> UserOut:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserOut.from_model(user)


@router.put("/users/me", response_model=UserOut)
def update_my_profile(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserOut:
    for field in ("name", "title", "bio", "location"):
        value = getattr(payload, field)
        if value is not None:
            setattr(current_user, field, value)

    if payload.skills is not None:
        current_user.skills.clear()
        for skill_name in payload.skills:
            skill_name = skill_name.strip()
            if not skill_name:
                continue
            skill = db.query(Skill).filter(Skill.name == skill_name).first()
            if not skill:
                skill = Skill(name=skill_name)
                db.add(skill)
                db.flush()
            current_user.skills.append(UserSkill(skill_id=skill.id))

    if payload.avatar_url is not None or payload.banner_url is not None:
        if not current_user.profile_media:
            current_user.profile_media = ProfileMedia(user_id=current_user.id)
        if payload.avatar_url is not None:
            current_user.profile_media.avatar_url = payload.avatar_url
        if payload.banner_url is not None:
            current_user.profile_media.banner_url = payload.banner_url

    db.commit()
    db.refresh(current_user)
    return UserOut.from_model(current_user)


@router.delete("/users/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> None:
    db.delete(current_user)
    db.commit()
