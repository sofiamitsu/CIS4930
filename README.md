# CIS4930 - Faculty Management Dashboard

A comprehensive faculty management system with React frontend and FastAPI backend.

## Project Structure

```
CIS4930/
├── frontend/          # React faculty management dashboard
│   ├── src/
│   │   ├── components/    # Faculty manager components
│   │   ├── App.jsx        # Main application
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
├── backend/           # FastAPI faculty management API
│   ├── main.py           # FastAPI app with faculty CRUD routes
│   ├── requirements.txt  # Python dependencies
│   ├── Dockerfile        # Backend container
│   └── .env             # Database configuration
├── docker-compose.yml # Container orchestration
├── Jenkinsfile        # CI/CD pipeline with health check
└── README.md
```

## Backend API (FastAPI)

### Faculty Management Endpoints

**GET /faculty**
- Returns list of all faculty members
- Response: `[{"id": 1, "name": "John Doe", "department": "Computer Science", "email": "john@university.edu"}, ...]`

**POST /faculty**
- Add a new faculty member
- Request body: `{"name": "string", "department": "string", "email": "string"}`
- Response: Created faculty object with ID

**DELETE /faculty/{id}**
- Remove a faculty member by ID
- Response: `{"message": "Faculty member deleted successfully"}`

**GET /health**
- Health check endpoint for Jenkins verification
- Response: `{"status": "ok"}`

### Database
- **SQLite** with SQLAlchemy ORM
- **Faculty table** with fields: id, name, department, email
- Auto-creates tables on startup

## Quick Start

### Backend Only
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API available at http://localhost:8003
# Health check: http://localhost:8003/health
```

### Full Stack (Docker)
```bash
# Build and run all services
docker compose up --build

# Backend API: http://localhost:8003
# Frontend Dashboard: http://localhost:80
```

### Frontend Only
```bash
cd frontend
yarn install
yarn dev
# Dashboard at http://localhost:5174
```

## Testing the API

```bash
# Health check
curl http://localhost:8003/health

# Get all faculty
curl http://localhost:8003/faculty

# Add a faculty member
curl -X POST http://localhost:8003/faculty \
  -H "Content-Type: application/json" \
  -d '{"name": "Dr. Jane Smith", "department": "Computer Science", "email": "jane@university.edu"}'

# Delete a faculty member
curl -X DELETE http://localhost:8003/faculty/1
```

## CI/CD Pipeline

The Jenkins pipeline includes:
1. **Build**: Docker compose build
2. **Verify**: Health check via `curl http://localhost:8003/health`

## Technology Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite, Uvicorn
- **Frontend**: React 18, Vite, faculty management dashboard UI
- **Database**: SQLite with SQLAlchemy ORM
- **Containerization**: Docker & Docker Compose
- **CI/CD**: Jenkins with health check verification