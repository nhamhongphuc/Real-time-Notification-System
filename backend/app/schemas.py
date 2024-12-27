from datetime import datetime
from pydantic import BaseModel
from typing import Optional

# User schemas
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True

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


# Comment schemas
class CommentCreate(BaseModel):
    content: str
    post_id: int

class CommentResponse(BaseModel):
    id: int
    content: str
    user_id: int
    post_id: int
    created_at: datetime
    username: Optional[str] = None

    class Config:
        orm_mode = True

# Like schemas
class LikeCreate(BaseModel):
    post_id: int

class LikeResponse(BaseModel):
    id: int
    user_id: int
    post_id: int

    class Config:
        orm_mode = True

# Notification schemas
class NotificationResponse(BaseModel):
    id: int
    message: str
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
