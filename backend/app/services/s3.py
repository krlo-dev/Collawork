import uuid

import boto3

from app.core.config import settings

ALLOWED_CONTENT_TYPES = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
}

_s3_client = boto3.client("s3", region_name=settings.aws_region)


def build_object_key(user_id: int, kind: str, content_type: str) -> str:
    ext = ALLOWED_CONTENT_TYPES[content_type]
    return f"{kind}s/{user_id}/{uuid.uuid4().hex}.{ext}"


def create_presigned_upload(key: str, content_type: str, expires_in: int = 300) -> str:
    return _s3_client.generate_presigned_url(
        "put_object",
        Params={"Bucket": settings.s3_bucket_name, "Key": key, "ContentType": content_type},
        ExpiresIn=expires_in,
    )


def public_object_url(key: str) -> str:
    return f"https://{settings.s3_bucket_name}.s3.{settings.aws_region}.amazonaws.com/{key}"
