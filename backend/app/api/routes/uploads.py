from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.upload import PresignRequest, PresignResponse
from app.services.s3 import build_object_key, create_presigned_upload, public_object_url

router = APIRouter(tags=["uploads"])


@router.post("/uploads/presign", response_model=PresignResponse)
def presign_upload(payload: PresignRequest, current_user: User = Depends(get_current_user)) -> PresignResponse:
    key = build_object_key(current_user.id, payload.kind, payload.content_type)
    upload_url = create_presigned_upload(key, payload.content_type)
    return PresignResponse(upload_url=upload_url, object_url=public_object_url(key))
