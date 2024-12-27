# Real-Time Notification System

A lightweight real-time notification system built with **FastAPI**, **WebSockets**, and **React**, designed to send instant alerts for actions such as comments and likes on board posts.

## Features

### Backend Features:
- **Post Management**:
  - Create and view posts.
- **Comments**:
  - Add comments to posts.
- **Likes**:
  - Like or unlike posts.
- **Notifications**:
  - Send instant notifications for new comments or likes.
  - Retrieve notification history.
  - Display notification count.

### Frontend Features:
- **Real-Time Notifications**:
  - Alerts appear instantly for any user action (comments, likes).
- **Interactive UI**:
  - View posts and interact (like/comment) dynamically.
- **Notification Panel**:
  - View notification history in real-time.

## Tech Stack

### Backend:
- **FastAPI**: For API and WebSocket communication.
- **SQLite**: For lightweight data storage.

### Frontend:
- **React**: For dynamic UI rendering.
- **WebSocket API**: For real-time communication.

## Prerequisites
- **Python**: Version 3.11+
- **Node.js**: Version 16+
- **npm**: For managing frontend dependencies

## Installation

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/nhamhongphuc/Real-time-Notification-System.git
   cd real-time-notification-system/backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: `env\\Scripts\\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will run at `http://localhost:8000`.

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will run at `http://localhost:3000`.

## Usage
1. Open the frontend in a web browser (`http://localhost:3000`).
2. Create posts, add comments, and like/unlike posts.
3. Real-time notifications will appear instantly in the notification panel.

## Project Structure

### Backend
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── auth.py
│   ├── posts.py
│   ├── comments.py
│   ├── likes.py
│   ├── notifications.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── requirements.txt
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── PostList.jsx       # Post interaction UI
│   │   ├── NotificationPanel.jsx  # Real-time notification display
│   ├── services/
│   │   ├── api.js            # API client functions
│   │   ├── websocket.js      # WebSocket client
│   ├── App.jsx               # Main app component
│   ├── index.js              # React DOM rendering
```

## API Endpoints

### Posts
- **Create Post**: `POST /posts/`
- **View Posts**: `GET /posts/`

### Comments
- **Add Comment**: `POST /posts/{post_id}/comments`
- **View Comments**: `GET /posts/{post_id}/comments`

### Likes
- **Like Post**: `POST /posts/{post_id}/like`
- **Unlike Post**: `DELETE /posts/{post_id}/like`

### Notifications
- **Get Notification Count**: `GET /notifications/count`
- **Get Notification History**: `GET /notifications`
- **Mark Notification as Read**: `PATCH /notifications/{id}`

## Future Enhancements
- **Authentication**: Add user-specific notifications.
- **Push Notifications**: Integrate browser/mobile push notifications.
- **Mobile Optimization**: Ensure full mobile responsiveness.
- **Read/Unread Status**: Highlight unread notifications.

## Contributing
1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Submit a pull request.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

---

Feel free to reach out with any questions or feature requests!
