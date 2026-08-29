from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.skill import Skill, UserSkill
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter(tags=["discovery"])


@router.get("/discovery", response_model=list[UserOut])
def discover_users(
    skill: str | None = Query(default=None, description="Filter by skill name"),
    location: str | None = Query(default=None, description="Filter by location"),
    q: str | None = Query(default=None, description="Search by name or title"),
    db: Session = Depends(get_db),
) -> list[UserOut]:
    query = db.query(User)

    if skill:
        query = (
            query.join(UserSkill, UserSkill.user_id == User.id)
            .join(Skill, Skill.id == UserSkill.skill_id)
            .filter(Skill.name.ilike(skill))
        )

    if location:
        query = query.filter(User.location.ilike(f"%{location}%"))

    if q:
        query = query.filter(User.name.ilike(f"%{q}%") | User.title.ilike(f"%{q}%"))

    users = query.order_by(User.created_at.desc()).all()
    return [UserOut.from_model(user) for user in users]
