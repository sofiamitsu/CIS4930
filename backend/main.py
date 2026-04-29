from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],  # React dev server ports
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./faculty.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Faculty model
class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    department = Column(String)
    email = Column(String, unique=True, index=True)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class FacultyCreate(BaseModel):
    name: str
    department: str
    email: str

class FacultyResponse(BaseModel):
    id: int
    name: str
    department: str
    email: str

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Faculty Management API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/faculty", response_model=list[FacultyResponse])
def get_faculty(db: Session = Depends(get_db)):
    faculty = db.query(Faculty).all()
    return faculty

@app.post("/faculty", response_model=FacultyResponse)
def create_faculty(faculty: FacultyCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(Faculty).filter(Faculty.email == faculty.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_faculty = Faculty(
        name=faculty.name,
        department=faculty.department,
        email=faculty.email
    )
    db.add(db_faculty)
    db.commit()
    db.refresh(db_faculty)
    return db_faculty

@app.delete("/faculty/{faculty_id}")
def delete_faculty(faculty_id: int, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty member not found")

    db.delete(faculty)
    db.commit()
    return {"message": "Faculty member deleted successfully"}
