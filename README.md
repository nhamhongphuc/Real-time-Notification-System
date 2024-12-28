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

2. Create a `.env` file and add necessary environment variables:
   ```bash
   cp .env.template .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will run at `http://localhost:3000`.

### Common Assignment
1. Navigate to the `CommonAssignment` folder:
   ```bash
   cd ../CommonAssignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start testing:
   ```bash
   npm test
   ```

## Usage
1. Open the frontend in a web browser (`http://localhost:3000`).
2. Create posts, add comments, and like/unlike posts.
3. Real-time notifications will appear instantly in the notification panel.

## Project Structure

### Backend
```
backend/
├── __pycache__/
├── .gitignore
├── app/
│   ├── __init__.py
│   ├── __pycache__/
│   ├── database.py
│   ├── main.py
│   ├── models/
│   │   ├── comment.py
│   │   ├── like.py
│   │   ├── notification.py
│   │   ├── post.py
│   │   ├── user.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── comments.py
│   │   ├── likes.py
│   │   ├── notifications.py
│   │   ├── posts.py
│   ├── schemas/
│   │   ├── comment.py
│   │   ├── like.py
│   │   ├── notification.py
│   │   ├── post.py
│   │   ├── user.py
├── image_uploads/
├── requirements.txt
```

### Frontend
```
frontend/
├── .babelrc
├── .env
├── .env.template
├── .gitignore
├── babel.config.js
├── eslint.config.mjs
├── jest.config.js
├── jest.setup.js
├── package.json
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
├── src/
│   ├── components/
│   │   ├── Guards/
│   │   │   ├── auth-guard.tsx
│   │   │   ├── guest-guard.tsx
│   │   │   ├── index.ts
│   │   ├── Header/
│   │   │   ├── index.tsx
│   │   ├── Modal/
│   │   │   ├── commentModal.tsx
│   │   │   ├── editPostModal.tsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── signin.tsx
│   │   │   ├── signup.tsx
│   │   ├── home.tsx
│   ├── routes/
│   │   ├── protected-routes.tsx
│   │   ├── public-routes.tsx
│   │   ├── theme-routes.ts
│   ├── services/
│   │   ├── api.ts
│   ├── store/
│   │   ├── authStore.ts
│   ├── ultils/
│   │   ├── ultils.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   ├── setupTests.ts
├── tsconfig.json
```

### Common Assignment
```
CommonAssignment/
├── .gitignore
├── package.json
├── randomGenerator.js
├── randomGenerator.test.js
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

## Future Enhancements
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