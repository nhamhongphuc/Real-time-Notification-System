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
    created_at: Optional[str]

    class Config:
        orm_mode = True
