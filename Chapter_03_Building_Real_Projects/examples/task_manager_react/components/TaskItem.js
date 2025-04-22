import React, { useState } from 'react';

function TaskItem({ task, toggleComplete, deleteTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEdit = () => {
    if (editText.trim() !== '') {
      editTask(task.id, editText);
      setIsEditing(false);
    }
  };

  const formatDate = (date) => {
    const taskDate = new Date(date);
    return taskDate.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <div className="edit-actions">
            <button onClick={handleEdit} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <span className="checkmark"></span>
            </label>
            <div className="task-details">
              <p className="task-text">{task.text}</p>
              <span className="task-date">{formatDate(task.createdAt)}</span>
            </div>
          </div>
          <div className="task-actions">
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            <button onClick={() => deleteTask(task.id)} className="delete-btn">Delete</button>
          </div>
        </>
      )}
    </li>
  );
}

export default TaskItem;
