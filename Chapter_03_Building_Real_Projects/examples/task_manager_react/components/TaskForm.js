import React, { useState } from 'react';

function TaskForm({ addTask }) {
  const [taskText, setTaskText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!taskText.trim()) {
      setError('Task cannot be empty');
      return;
    }
    
    // Add the task
    addTask(taskText.trim());
    
    // Clear the form and error
    setTaskText('');
    setError('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-control">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task..."
          className={error ? 'input-error' : ''}
        />
        {error && <p className="error-message">{error}</p>}
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
