/*
 * Title: Chapter 03 - Beginner Example: Todo App 
 * Description: A simple React-based todo application
 * Chapter: 03 - Building Real Projects with AI Assistance
 * Skill Level: Beginner
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';

function App() {
  // Initialize tasks from localStorage or empty array
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  // Track current filter state
  const [filter, setFilter] = useState('all');
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Add a new task to the list
  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date()
    };
    setTasks([...tasks, newTask]);
  };
  
  // Toggle completion status of a task
  const toggleComplete = (id) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Filter tasks based on current filter state
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all' filter
  });
  
  // Calculate task statistics
  const stats = {
    total: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length
  };

  return (
    <div className="app">
      <h1>Vibe Coding Todo App</h1>
      <p className="app-description">
        A simple todo app built with React and AI assistance
      </p>
      
      <TaskForm addTask={addTask} />
      
      <div className="filter-container">
        <TaskFilter filter={filter} setFilter={setFilter} />
        <div className="stats">
          <span>{stats.active} active</span>
          <span>{stats.completed} completed</span>
          <span>{stats.total} total</span>
        </div>
      </div>
      
      <TaskList 
        tasks={filteredTasks} 
        toggleComplete={toggleComplete} 
        deleteTask={deleteTask} 
      />
      
      <footer>
        <p>Built with Vibe Coding - Chapter 03 Beginner Example</p>
        <p>Part of the "Building Real Projects with AI Assistance" chapter</p>
      </footer>
    </div>
  );
}

export default App;

/*
 * Navigation:
 * [⬅️ Return to Chapter](../README.md) | [📚 Main Content](../Chapter_03_Main.md) | [🔰 Beginner Level](../Chapter_03_Beginner.md)
 */
