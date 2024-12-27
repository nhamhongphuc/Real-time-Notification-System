from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.post import Post
from app.models.like import Like
from app.routers.auth import get_current_user
from app.routers.notifications import notify_like, notify_unlike
from app.schemas.like import LikeResponse, LikeCreate

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

    # Send notifications for like to author of the post
    await notify_like(user.username, post.user_id, like.post_id, db)
    return new_like

@router.delete("/{post_id}", response_model=dict)
async def unlike_post(post_id: int, db: db_dependency, user: user_dependency):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    like = db.query(Like).filter(Like.post_id == post_id, Like.user_id == user.id).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    db.delete(like)
    db.commit()

    # Send notifications unlike to author of the post
    await notify_unlike(user.username, post.user_id, post_id, db)
    return {"detail": "Unliked successfully"}