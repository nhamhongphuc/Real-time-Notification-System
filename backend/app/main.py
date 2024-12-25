from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from jose import JWTError, jwt
from app import auth, posts, comments, likes
from app.database import Base, engine
from app.database import SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from app.auth import get_current_user
from app.notifications import manager
from app.models import User
# Initialize database
Base.metadata.create_all(bind=engine)

# Create FastAPI instance
app = FastAPI()
app.include_router(auth.router)
app.include_router(posts.router, prefix="/posts", tags=["Posts"])
app.include_router(comments.router, prefix="/commnets", tags=["Commnets"])
app.include_router(likes.router, prefix="/likes", tags=["Likes"])

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
async def user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed")
    return {"User": user}

async def get_current_user_from_token(websocket: WebSocket, db: Session = Depends(get_db)):
    token = websocket.headers.get('Authorization')
    if token is None or not token.startswith("Bearer "):
        print("Authorization header missing or invalid")
        raise HTTPException(status_code=403, detail="Authorization header missing or invalid")
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

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int, user: User = Depends(get_current_user_from_token)):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", client_id)
            await manager.broadcast(f"Client #{client_id} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)
