from fastapi import APIRouter, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Comment, Post
from app.schemas import CommentCreate, CommentResponse
from app.auth import get_current_user
from app.notifications import notify_comment
from app.models import User

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

@router.post("/", response_model=CommentResponse)
async def create_comment(comment: CommentCreate, db: db_dependency, user: user_dependency):
    new_comment = Comment(content=comment.content, post_id=comment.post_id, user_id=user.id)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    # Send notifications for new comments to author of the post
    post = db.query(Post).filter(Post.id == comment.post_id).first()
    if post:
        await notify_comment(new_comment, user.username, post.user_id, db)

    return new_comment

@router.get("/{post_id}", response_model=list[CommentResponse])
def get_comments(post_id: int, db: db_dependency):
    comments = db.query(Comment).order_by(Comment.created_at.desc()).filter(Comment.post_id == post_id).all()
    for comment in comments:
        user = db.query(User).filter(User.id == comment.user_id).first()
        comment.username = user.username if user else "Unknown"
    return comments
