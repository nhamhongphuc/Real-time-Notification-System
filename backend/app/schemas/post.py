from datetime import datetime
from pydantic import BaseModel
from typing import Optional

# Post schemas
class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    user_id: int
    image_url: Optional[str] = None
    image_data: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True

# Post query schemas
class GetPostResponse(BaseModel):
    id: int
    title: str
    content: str
    user_id: int
    image_url: Optional[str] = None
    image_data: Optional[str] = None
    created_at: datetime
    total_likes: int
    total_comments: int
    is_liked_by_current_user: bool
    username: Optional[str] = None

    class Config:
        orm_mode = True