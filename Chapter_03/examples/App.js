import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  
  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Add a new task
  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date()
    };
    setTasks([...tasks, newTask]);
  };
  
  // Toggle task completion status
  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  // Edit a task
  const editTask = (taskId, newText) => {
    setTasks(
      tasks.map(task => 
        task.id === taskId ? { ...task, text: newText } : task
      )
    );
  };
  
  // Get filtered tasks based on current filter
  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  
  return (
    <div className="app-container">
      <header>
        <h1>Task Manager</h1>
        <div className="task-stats">
          <span>Total: {totalTasks}</span>
          <span>Active: {activeTasks}</span>
          <span>Completed: {completedTasks}</span>
        </div>
      </header>
      
      <main>
        <TaskForm addTask={addTask} />
        
        <TaskFilter currentFilter={filter} setFilter={setFilter} />
        
        <TaskList 
          tasks={getFilteredTasks()} 
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      </main>
      
      <footer>
        <p>Built with React & Vibe Coding • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
