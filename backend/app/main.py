from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from app.routers import auth, posts, comments, likes, notifications
from app.database import Base, engine
from app.database import SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from app.routers.auth import get_current_user
from app.routers.notifications import manager
from app.models.user import User
# Initialize database
Base.metadata.create_all(bind=engine)

# Create FastAPI instance
app = FastAPI()
app.include_router(auth.router)
app.include_router(posts.router, prefix="/posts", tags=["Posts"])
app.include_router(comments.router, prefix="/comments", tags=["comments"])
app.include_router(likes.router, prefix="/likes", tags=["Likes"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: user_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed")
    user_data = user.__dict__.copy()
    user_data.pop("hashed_password", None)
    return {"User": user_data}


async def get_current_user_from_token(token: str, db:db_dependency):
    if token is None or not token.startswith("Bearer "):
        print("Authorization header missing or invalid")
        raise HTTPException(
            status_code=403, detail="Authorization header missing or invalid")
    token = token.split(" ")[1]
    print(f"Token: {token}")
    try:
        payload = jwt.decode(token, '123456', algorithms=['HS256'])
        print(f"Payload: {payload}")
        username: str = payload.get("sub")
        if username is None:
            print("Invalid token: username is None")
            raise HTTPException(status_code=403, detail="Invalid token")
    except JWTError as e:
        print(f"Invalid token: {e}")
        raise HTTPException(status_code=403, detail="Invalid token")
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        print("User not found")
        raise HTTPException(status_code=403, detail="User not found")
    return user

@app.websocket("/ws/{client_id}/{token}")
async def websocket_endpoint(websocket: WebSocket, client_id: int, token: str, db: db_dependency):
    # Extract the token from the URL parameter
    token = f"Bearer {token}"
    await get_current_user_from_token(token, db)
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", client_id)
            await manager.broadcast(f"Client #{client_id} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)

# Add CORS middleware
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
