from typing import Literal

from pydantic import BaseModel


class PresignRequest(BaseModel):
    kind: Literal["avatar", "banner"]
    content_type: Literal["image/png", "image/jpeg", "image/webp"]


class PresignResponse(BaseModel):
    upload_url: str
    object_url: str
