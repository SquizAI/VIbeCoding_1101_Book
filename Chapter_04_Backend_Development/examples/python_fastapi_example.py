#!/usr/bin/env python3
"""
FastAPI Task Management API

This example demonstrates a simple task management API built with FastAPI,
featuring automatic documentation and type validation.
"""

from fastapi import FastAPI, HTTPException, Body, Depends, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
import json
import os
from enum import Enum

# Define our data models
class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, example="Complete project proposal")
    description: Optional[str] = Field(None, max_length=1000, example="Write up the initial draft of the project proposal")
    status: TaskStatus = Field(default=TaskStatus.pending)
    due_date: Optional[date] = Field(None, example="2025-05-15")

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            date: lambda v: v.isoformat()
        }

# Initialize FastAPI
app = FastAPI(
    title="Task Management API",
    description="A simple API for managing tasks",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data file path
DATA_FILE = os.path.join(os.path.dirname(__file__), "tasks_data.json")

# Helper functions for data access
def get_tasks():
    """Read tasks from the JSON file"""
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # Return empty task list if file doesn't exist or is invalid
        return {"tasks": []}

def save_tasks(data):
    """Save tasks to the JSON file"""
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2, default=str)

# Dependency for common operations
async def get_task_by_id(task_id: int = Path(..., description="The ID of the task to get")):
    """Get a task by ID or raise 404 if not found"""
    data = get_tasks()
    for task in data["tasks"]:
        if task["id"] == task_id:
            return task
    raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found")

# API Routes
@app.get("/api/tasks", response_model=List[Task], tags=["Tasks"])
async def list_tasks(
    status: Optional[TaskStatus] = Query(None, description="Filter tasks by status"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of tasks to return")
):
    """
    Get all tasks with optional filtering.
    """
    data = get_tasks()
    tasks = data["tasks"]
    
    # Apply filters if provided
    if status:
        tasks = [task for task in tasks if task["status"] == status]
    
    # Apply limit
    tasks = tasks[:limit]
    
    return tasks

@app.get("/api/tasks/{task_id}", response_model=Task, tags=["Tasks"])
async def get_task(task: dict = Depends(get_task_by_id)):
    """
    Get a specific task by its ID.
    """
    return task

@app.post("/api/tasks", response_model=Task, status_code=201, tags=["Tasks"])
async def create_task(task: TaskCreate = Body(...)):
    """
    Create a new task.
    """
    data = get_tasks()
    
    # Generate a new ID
    new_id = 1
    if data["tasks"]:
        new_id = max(task["id"] for task in data["tasks"]) + 1
    
    # Create task object with generated fields
    new_task = {
        **task.dict(),
        "id": new_id,
        "created_at": datetime.now(),
        "updated_at": None
    }
    
    # Add to tasks list
    data["tasks"].append(new_task)
    save_tasks(data)
    
    return new_task

@app.put("/api/tasks/{task_id}", response_model=Task, tags=["Tasks"])
async def update_task(
    update_data: TaskBase = Body(...),
    task: dict = Depends(get_task_by_id)
):
    """
    Update an existing task.
    """
    data = get_tasks()
    
    # Find and update the task
    for i, t in enumerate(data["tasks"]):
        if t["id"] == task["id"]:
            # Update task with new data
            updated_task = {
                **task,
                **update_data.dict(exclude_unset=True),
                "updated_at": datetime.now()
            }
            data["tasks"][i] = updated_task
            save_tasks(data)
            return updated_task
    
    # This should never happen due to the dependency
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/api/tasks/{task_id}", tags=["Tasks"])
async def delete_task(task: dict = Depends(get_task_by_id)):
    """
    Delete a task.
    """
    data = get_tasks()
    
    # Remove the task
    data["tasks"] = [t for t in data["tasks"] if t["id"] != task["id"]]
    save_tasks(data)
    
    return {"message": f"Task with ID {task['id']} deleted successfully"}

# Create data file if it doesn't exist
if not os.path.exists(DATA_FILE):
    save_tasks({"tasks": []})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
