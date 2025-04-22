#!/usr/bin/env python3
"""
Title: Chapter 03 - Advanced Example: RESTful API Service
Description: A FastAPI-based RESTful API service with database integration
Chapter: 03 - Building Real Projects with AI Assistance
Skill Level: Advanced
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import datetime
import os
import uvicorn

# Database Configuration
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class TaskModel(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    completed = Column(Boolean, default=False)
    priority = Column(Integer, default=1)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models for API
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: int = 1

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[int] = None

class Task(TaskBase):
    id: int
    completed: bool
    created_at: datetime.datetime
    updated_at: datetime.datetime
    
    class Config:
        orm_mode = True

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# FastAPI App
app = FastAPI(
    title="Task Management API",
    description="RESTful API for managing tasks - Chapter 03 Advanced Example",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
@app.get("/")
def read_root():
    return {
        "title": "Task Management API",
        "description": "Chapter 03 - Advanced Example: Building Real Projects with AI Assistance",
        "docs_url": "/docs"
    }

@app.get("/tasks", response_model=List[Task])
def read_tasks(
    skip: int = 0, 
    limit: int = 100, 
    completed: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get all tasks with optional filtering"""
    query = db.query(TaskModel)
    
    if completed is not None:
        query = query.filter(TaskModel.completed == completed)
    
    return query.offset(skip).limit(limit).all()

@app.get("/tasks/{task_id}", response_model=Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    """Get a single task by ID"""
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@app.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task"""
    db_task = TaskModel(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    """Update an existing task"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    # Update only provided fields
    update_data = task_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return None

@app.get("/metrics", response_model=dict)
def get_metrics(db: Session = Depends(get_db)):
    """Get task metrics"""
    total_count = db.query(TaskModel).count()
    completed_count = db.query(TaskModel).filter(TaskModel.completed == True).count()
    active_count = total_count - completed_count
    
    high_priority_count = db.query(TaskModel).filter(TaskModel.priority >= 3).count()
    
    # Added in the past 24 hours
    yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
    recent_count = db.query(TaskModel).filter(TaskModel.created_at >= yesterday).count()
    
    return {
        "total": total_count,
        "completed": completed_count,
        "active": active_count,
        "high_priority": high_priority_count,
        "added_last_24h": recent_count
    }

# Run the server if script is executed directly
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

"""
Navigation:
[⬅️ Return to Chapter](../README.md) | [📚 Main Content](../Chapter_03_Main.md) | [⚙️ Advanced Level](../Chapter_03_Advanced.md)
"""
