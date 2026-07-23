# 🚀 Multi-Agent AI Workspace

An AI-powered development workspace where multiple specialized AI agents collaborate to analyze requirements, design architecture, generate code, test applications, and create documentation automatically.

## 📌 Overview

Multi-Agent AI Workspace is designed to streamline software development by orchestrating multiple AI agents that work together throughout the development lifecycle. Users can create projects, interact with AI, and receive generated code, documentation, and project structures from specialized agents.

---

## ✨ Features

* 🔐 User Authentication (JWT)
* 📁 Project Management
* 🤖 AI Chat Interface
* 👥 Multi-Agent Collaboration
* 🧠 Agent Orchestrator
* 📂 Automatic Project Generation
* 📝 Documentation Generation
* 🗄️ PostgreSQL Database Integration
* ⚡ FastAPI Backend
* 🎨 Modern React Frontend

---

## 🏗️ System Architecture

```
                User
                  │
                  ▼
          React Frontend
                  │
          REST API Requests
                  │
                  ▼
          FastAPI Backend
                  │
      ┌───────────┼───────────┐
      │           │           │
      ▼           ▼           ▼
 Authentication  AI Engine  Project Generator
      │           │           │
      └───────────┼───────────┘
                  │
                  ▼
        Agent Orchestrator
                  │
    ┌──────┬────────┬────────┬────────┐
    ▼      ▼        ▼        ▼
Research Architect Coding Testing
 Agent      Agent    Agent    Agent
                  │
                  ▼
             PostgreSQL
```

---
# Project Architecture
<img width="1536" height="1024" alt="ChatGPT Image Jul 23, 2026, 06_23_32 PM" src="https://github.com/user-attachments/assets/36b07df3-64e0-4085-909f-a542981d7123" />


# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Material UI

## Backend

* FastAPI
* Python
* SQLAlchemy
* JWT Authentication
* Uvicorn

## Database

* PostgreSQL

## AI Technologies

* OpenAI API
* DeepSeek API
* LangChain (Planned)

## Tools

* Git
* GitHub
* VS Code

---

# 📂 Project Structure

```
multi-agent-workspace/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── routers/
│   ├── models/
│   ├── database/
│   ├── services/
│   ├── .env
│   └── requirements.txt
│
├── README.md
└── .gitignore
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/akashkumar3473/Multi-agent-workspace1.git
```

## 2. Navigate to the Project

```bash
cd Multi-agent-workspace1
```

## 3. Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file inside the backend directory.

Example:

```
OPENAI_API_KEY=your_api_key
DEEPSEEK_API_KEY=your_api_key
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

Backend URL:

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
http://127.0.0.1:8000/docs
```

---

## 4. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# 📸 Screenshots

Add screenshots here after running the project.

* Login Page
* Dashboard
* AI Chat
* Project Generator
* Agent Workflow

---

# 🎯 Future Improvements

* AI Code Generation
* File Editing Agent
* GitHub Repository Generator
* Docker Deployment
* Real-Time Collaboration
* RAG-based Knowledge Retrieval
* Voice Commands
* Code Review Agent
* CI/CD Integration

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Akash Kumar**

* GitHub: https://github.com/akashkumar3473
* LinkedIn: Add your LinkedIn profile here

If you find this project helpful, consider giving it a ⭐ on GitHub.
