from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Like, Post
from app.schemas import LikeCreate, LikeResponse
from app.auth import get_current_user
from app.notifications import notify_like

router = APIRouter(
    dependencies=[Depends(get_current_user)]
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/", response_model=LikeResponse)
async def like_post(like: LikeCreate, db: db_dependency, user: user_dependency):
    post = db.query(Post).filter(Post.id == like.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    existing_like = db.query(Like).filter(Like.post_id == like.post_id, Like.user_id == user.id).first()
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked this post")
    new_like = Like(post_id=like.post_id, user_id=user.id)
    db.add(new_like)
    db.commit()
    db.refresh(new_like)

    # Send notifications for new comments to author of the post
    await notify_like(new_like, user.username, post.user_id)
    return new_like

@router.delete("/{post_id}", response_model=dict)
def unlike_post(post_id: int, db: db_dependency, user: user_dependency):
    like = db.query(Like).filter(Like.post_id == post_id, Like.user_id == user.id).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    db.delete(like)
    db.commit()
    return {"detail": "Unliked successfully"}