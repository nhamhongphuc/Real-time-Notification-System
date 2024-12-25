from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException, status
from typing import Annotated, Dict, List

from app.database import get_db
from sqlalchemy.orm import Session
from app.models import User
from app.auth import get_current_user
from app.schemas import CommentResponse


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

@router.post("/notify/comment")
async def notify_comment(comment: CommentResponse, username: str, client_id: int):
    message = f"{username} send new comment in your post: {comment.content}"
    await manager.send_personal_message(message, client_id)
    return {"message": "Notification sent"}

@router.post("/notify/like")
async def notify_like(like: str, username: str, client_id: int):
    message = f"{username} liked your post"
    await manager.send_personal_message(message, client_id)
    return {"message": "Notification sent"}

@router.get("/notifications/count")
async def get_notification_count():
    return {"count": len(manager.active_connections)}