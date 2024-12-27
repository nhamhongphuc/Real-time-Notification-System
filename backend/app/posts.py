from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import Annotated, List, Optional
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Comment, Like, Post, User
from app.schemas import GetPostResponse, PostResponse
from app.auth import get_current_user
import shutil
import os
import uuid
import base64

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
async def create_post(
    title: str,
    content: str,
    db: db_dependency,
    user: user_dependency,
    image_url: Optional[str] = None
):
    """
    Create a new post with an optional image URL.
    """
    new_post = Post(
        title=title,
        content=content,
        user_id=user.id,
        created_at=datetime.utcnow(),
        image_url=image_url
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.get("/", response_model=List[GetPostResponse])
def get_all_posts(db: db_dependency, current_user: user_dependency, skip: int = 0, limit: int = 10):
    """
    Retrieve all posts with pagination.
    """
    posts = db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    for post in posts:
        post.total_likes = db.query(Like).filter(Like.post_id == post.id).count()
        post.total_comments = db.query(Comment).filter(Comment.post_id == post.id).count()
        post.is_liked_by_current_user = db.query(Like).filter(Like.post_id == post.id, Like.user_id == current_user.id).count() > 0
        post.username = db.query(User).filter(User.id == post.user_id).first().username
        if post.image_url:
            file_path = post.image_url.lstrip('/')
            if os.path.exists(file_path):
                with open(file_path, "rb") as image_file:
                    post.image_data = base64.b64encode(image_file.read()).decode('utf-8')
            else:
                post.image_data = None
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

    # Delete associated likes
    db.query(Like).filter(Like.post_id == post.id).delete()

    # Delete associated comments
    db.query(Comment).filter(Comment.post_id == post.id).delete()

    # Delete the image file if it exists
    if post.image_url:
        file_path = post.image_url.lstrip('/')
        if os.path.exists(file_path):
            os.remove(file_path)

    # Delete the post
    db.delete(post)
    db.commit()
    return {"detail": "Post deleted successfully"}

@router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image for a specific post.
    """
    upload_dir = "image_uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_location = os.path.join(upload_dir, unique_filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    file_url = f"/{file_location}"
    return {"file_url": file_url}