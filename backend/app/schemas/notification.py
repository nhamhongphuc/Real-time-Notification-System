from pydantic import BaseModel
from datetime import datetime

# Notification schemas
class NotificationResponse(BaseModel):
    id: int
    message: str
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True