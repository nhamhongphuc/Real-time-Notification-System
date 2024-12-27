from pydantic import BaseModel

# Like schemas
class LikeCreate(BaseModel):
    post_id: int

class LikeResponse(BaseModel):
    id: int
    user_id: int
    post_id: int

    class Config:
        orm_mode = True