from pydantic import BaseModel, ConfigDict


class ProfileMediaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    avatar_url: str | None = None
    banner_url: str | None = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    title: str | None = None
    bio: str | None = None
    location: str | None = None
    skills: list[str] = []
    profile_media: ProfileMediaOut | None = None

    @classmethod
    def from_model(cls, user) -> "UserOut":
        return cls(
            id=user.id,
            name=user.name,
            email=user.email,
            title=user.title,
            bio=user.bio,
            location=user.location,
            skills=[us.skill.name for us in user.skills],
            profile_media=ProfileMediaOut.model_validate(user.profile_media) if user.profile_media else None,
        )


class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    title: str | None = None
    bio: str | None = None
    location: str | None = None
    skills: list[str] | None = None
    avatar_url: str | None = None
    banner_url: str | None = None
