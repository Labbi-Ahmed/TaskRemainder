# Task Remainder Application

This is a monorepo for a Task Remainder application, featuring a React frontend and a Spring Boot backend.

## Project Overview

The application allows users to manage tasks, set reminders, and receive push notifications.

## Technology Stack

*   **Frontend:** React.js
*   **Backend:** Spring Boot (Java)
*   **Database:** PostgreSQL

## Setup Instructions

### Prerequisites

*   Node.js (with npm or yarn)
*   Java Development Kit (JDK) 17 or higher
*   Maven
*   PostgreSQL database server
*   Git

### 1. Clone the Repository

```bash
git clone https://github.com/Labbi-Ahmed/TaskRemainder.git
cd TaskRemainder
```

### 2. Backend Setup (Spring Boot)

The backend project will be located in the `backend/` directory.

1.  **Database Configuration:**
    *   Ensure you have a PostgreSQL server running.
    *   Create a database for this application (e.g., `taskremainder_db`).
    *   Update the `src/main/resources/application.properties` (or `application.yml`) file in the `backend/` directory with your PostgreSQL connection details (e.g., database URL, username, password).

2.  **Build and Run:**
    ```bash
    cd backend
    mvn clean install
    mvn spring-boot:run
    ```
    The backend will typically run on `http://localhost:8080`.

### 3. Frontend Setup (React)

The frontend project is located in the `frontend/` directory.

1.  **Install Dependencies:**
    ```bash
    cd frontend
    npm install # or yarn install
    ```

2.  **Run the Application:**
    ```bash
    npm start # or yarn start
    ```
    The frontend application will typically open in your browser at `http://localhost:3000`.

## Development Workflow

*   **Issues:** Refer to the GitHub Issues for a detailed breakdown of tasks and features.
*   **Commits:** Please follow conventional commit guidelines.

---
**Note:** This `README.md` will be updated as the project progresses.
