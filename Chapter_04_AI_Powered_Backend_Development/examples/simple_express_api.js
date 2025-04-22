// Simple Express REST API
// This example demonstrates a basic task management API with Node.js and Express

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(express.json());

// Helper function to read tasks from the JSON file
async function readTasks() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty task array
    if (error.code === 'ENOENT') {
      return { tasks: [] };
    }
    throw error;
  }
}

// Helper function to write tasks to the JSON file
async function writeTasks(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const data = await readTasks();
    res.json(data.tasks);
  } catch (error) {
    console.error('Error reading tasks:', error);
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

// Get a single task by ID
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const data = await readTasks();
    
    const task = data.tasks.find(task => task.id === taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error retrieving task:', error);
    res.status(500).json({ error: 'Failed to retrieve task' });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const data = await readTasks();
    
    // Generate a new ID (simple approach)
    const newId = data.tasks.length > 0 
      ? Math.max(...data.tasks.map(task => task.id)) + 1 
      : 1;
    
    // Create new task
    const newTask = {
      id: newId,
      title,
      description: description || '',
      status: status || 'pending',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    };
    
    // Add to tasks array
    data.tasks.push(newTask);
    
    // Save to file
    await writeTasks(data);
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update an existing task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, description, status, dueDate } = req.body;
    
    const data = await readTasks();
    
    // Find the task index
    const taskIndex = data.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update task properties
    data.tasks[taskIndex] = {
      ...data.tasks[taskIndex],
      title: title || data.tasks[taskIndex].title,
      description: description !== undefined ? description : data.tasks[taskIndex].description,
      status: status || data.tasks[taskIndex].status,
      dueDate: dueDate !== undefined ? dueDate : data.tasks[taskIndex].dueDate,
      updatedAt: new Date().toISOString()
    };
    
    // Save to file
    await writeTasks(data);
    
    res.json(data.tasks[taskIndex]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const data = await readTasks();
    
    // Find the task index
    const taskIndex = data.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Remove the task
    data.tasks.splice(taskIndex, 1);
    
    // Save to file
    await writeTasks(data);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create the data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
    console.log('Data file exists');
  } catch (error) {
    // File doesn't exist, create it with empty tasks array
    await writeTasks({ tasks: [] });
    console.log('Created new data file');
  }
}

initializeDataFile().catch(err => {
  console.error('Error initializing data file:', err);
});

// Export for testing
module.exports = app;
