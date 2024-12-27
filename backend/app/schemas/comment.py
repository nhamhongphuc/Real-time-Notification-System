from datetime import datetime
from pydantic import BaseModel
from typing import Optional

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