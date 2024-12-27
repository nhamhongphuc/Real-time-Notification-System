from fastapi import APIRouter, Depends, WebSocket
from typing import Annotated, Dict, List
from app.database import get_db
from sqlalchemy.orm import Session
from app.models import Notification
from app.auth import get_current_user
from app.schemas import CommentResponse, NotificationResponse
import json


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.client_connections: Dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: int):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.client_connections[client_id] = websocket

    def disconnect(self, websocket: WebSocket, client_id: int):
        self.active_connections.remove(websocket)
        if client_id in self.client_connections:
            del self.client_connections[client_id]

    async def send_personal_message(self, message: str, client_id: int):
        websocket = self.client_connections.get(client_id)
        if websocket:
            await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()
router = APIRouter()
user_dependency = Annotated[dict, Depends(get_current_user)]
db_dependency = Annotated[Session, Depends(get_db)]


async def notify_comment(comment: CommentResponse, username: str, client_id: int, db: db_dependency):
    data = {
        "action": "comment",
        "content": comment.content,
        "user_id": client_id,
        "from": username,
        "post_id": comment.post_id,
        "created_at": str(comment.created_at),
    }
    message = json.dumps(data)
    notification = Notification(
        user_id=client_id,
        message=message
    )
    db.add(notification)
    db.commit()
    await manager.broadcast(message)
    return {"message": "Notification sent"}


async def notify_like(username: str, client_id: int, post_id: int, db: db_dependency):
    data = {
        "action": "like",
        "content": "like",
        "user_id": client_id,
        "from": username,
        "post_id": post_id,
        "created_at": "",
    }
    message = json.dumps(data)
    notification = Notification(
        user_id=client_id,
        message=message
    )
    db.add(notification)
    db.commit()
    await manager.broadcast(message)
    return {"message": "Notification sent"}

async def notify_unlike(username: str, client_id: int, post_id: int, db: db_dependency):
    data = {
        "action": "unlike",
        "content": "unlike",
        "user_id": client_id,
        "from": username,
        "post_id": post_id,
        "created_at": "",
    }
    message = json.dumps(data)
    notification = Notification(
        user_id=client_id,
        message=message
    )
    db.add(notification)
    db.commit()
    await manager.broadcast(message)
    return {"message": "Notification sent"}


@router.get("/notifications/count")
async def get_notification_count():
    return {"count": len(manager.active_connections)}


@router.get("/", response_model=list[NotificationResponse])
def get_comments(db: db_dependency, user: user_dependency):
    comments = db.query(Notification).order_by(
        Notification.created_at.desc()).filter(Notification.user_id == user.id).all()
    return comments
