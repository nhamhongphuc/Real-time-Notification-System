from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Post
from app.schemas import PostResponse
from app.auth import get_current_user

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

@router.post("/", response_model=PostResponse)
def create_post(title: str, content: str, db: db_dependency, user: user_dependency):
    """
    Create a new post.
    """
    print(user)
    new_post = Post(title=title, content=content, user_id=user.id)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.get("/", response_model=list[PostResponse])
def get_all_posts(db: db_dependency, skip: int = 0, limit: int = 10):
    """
    Retrieve all posts with pagination.
    """
    posts = db.query(Post).offset(skip).limit(limit).all()
    return posts

@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: db_dependency):
    """
    Retrieve a specific post by ID.
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.put("/{post_id}", response_model=PostResponse)
def update_post(post_id: int, title: str, content: str, db: db_dependency, current_user: user_dependency):
    """
    Update a post by ID. Only the creator can update their post.
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")

    post.title = title
    post.content = content
    db.commit()
    db.refresh(post)
    return post

@router.delete("/{post_id}")
def delete_post(post_id: int, db: db_dependency, current_user: user_dependency):
    """
    Delete a post by ID. Only the creator can delete their post.
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    db.delete(post)
    db.commit()
    return {"detail": "Post deleted successfully"}
