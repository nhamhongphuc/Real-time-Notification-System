# Post Sharing App

## Introduction
This project is a web application for sharing Post. It demonstrates backend and frontend development skills, including user registration, video sharing, and real-time notifications. The app is built using FastAPI for the backend and React with TypeScript for the frontend. The key features of the application include:

1. User registration and login
2. Sharing post
3. Viewing a list of shared videos
4. Real-time notifications for new video shares

## Prerequisites
Before setting up the project, ensure you have the following software installed:

- **Node.js**: Version 14.17.0 or higher
- **Yarn**: Version 1.22.10 or higher
- **PostgreSQL**: Version 12 or higher
- **Docker**: (optional, for Docker deployment)

## Installation & Configuration
Follow these steps to set up the project on your local machine:

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  Run PostgreSQL on Docker:
    ```bash
    docker run --name postgres-nest -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
    ```

3. Install backend dependencies:
    ```bash
    cd backend
    yarn install
    ```

4. Install frontend dependencies:
    ```bash
    cd ../frontend
    yarn install
    ```

5. Configure environment variables:
    - Copy `.env.stage.dev.template` to `.env.stage.dev` in backend and frontend directories
    - Copy `.env.template` to `.env` in frontend directories
    - Update the values in `.env.stage.dev` with your JWT_SECRET and YTB_API_KEY

## Running the Application
Start the development server:

1. Start the NestJS server:
    ```bash
    cd backend
    yarn start:dev
    ```

2. Start the React dev server:
    ```bash
    cd ../frontend
    yarn start
    ```

3. Access the application in your web browser at `http://localhost:3000`


## Usage
To use the application:

1. Register a new user account.
2. Log in with your credentials.
3. Share a YouTube video by pasting the video URL.
4. View the list of shared videos.
5. Receive real-time notifications when new videos are shared.

## Running Tests
To run the test suite:

1. Run backend tests:
    ```bash
    cd backend
    yarn test
    ```

2. Run frontend tests:
    ```bash
    cd ../frontend
    yarn test
    ```

## Troubleshooting
Common issues and their solutions:

- **Database connection error**: Ensure PostgreSQL is running and the credentials in `.env.stage.dev` are correct.
- **Frontend issues**: Make sure Node.js and Yarn are installed correctly, and dependencies are up-to-date.


By following this README, you should be able to set up and run the YouTube Video Sharing App successfully. Happy coding!
