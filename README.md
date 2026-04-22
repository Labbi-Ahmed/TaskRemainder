# 🧠 Smart Content Reminder App

Build an application that helps users **save important content (links, notes, documents)** and **get reminded at the right time to revisit them**.

This is NOT just a task manager. It is a **“save now, act later” system** focused on solving the problem of forgotten saved content.

## 🎯 Goal
Users often save YouTube videos, articles, or social media posts but rarely come back to them. This app ensures that when a user saves content, they:
1. Attach it to a **task**.
2. Assign a **time or schedule**.
3. Receive a **reminder notification**.

## 🧩 Core Features (MVP)
*   **Task Creation:** Title, description, content link (URL), notes, and timestamps.
*   **Scheduling System:** Datetime support and recurring rules (daily, weekly).
*   **Reminder System:** In-app notifications triggered by scheduled times.
*   **Categories & Tags:** Organization via custom categories and multiple tags.
*   **Task Status:** Pending, Completed, and Missed tracking.
*   **Dashboard:** Visual overview of upcoming, missed, and completed tasks with a "Life Discipline Score".

## 🛠️ Technology Stack
*   **Frontend:** React.js (Tailwind CSS)
*   **Backend:** Spring Boot (Java)
*   **Database:** PostgreSQL

## 🚀 Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   JDK 17+
*   Maven
*   PostgreSQL
*   Git

### 1. Clone & Install
```bash
git clone https://github.com/Labbi-Ahmed/TaskRemainder.git
cd TaskRemainder
```

### 2. Backend Setup
The backend is located in the `backend/` directory (Coming soon).
1. Create a database `taskremainder_db`.
2. Configure `application.properties` with your PostgreSQL credentials.
3. Run: `mvn spring-boot:run`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## ⚙️ Development Workflow
We follow a **Research -> Strategy -> Execution** lifecycle. Features are broken into small, implementable GitHub issues.

---
*Note: This project is actively evolving to solve the "saved but forgotten" content problem.*
