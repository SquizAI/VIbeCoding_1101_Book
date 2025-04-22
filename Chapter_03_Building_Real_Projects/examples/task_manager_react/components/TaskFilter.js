import React from 'react';

function TaskFilter({ currentFilter, setFilter }) {
  return (
    <div className="task-filter">
      <button 
        className={currentFilter === 'all' ? 'active' : ''} 
        onClick={() => setFilter('all')}
      >
        All
      </button>
      <button 
        className={currentFilter === 'active' ? 'active' : ''} 
        onClick={() => setFilter('active')}
      >
        Active
      </button>
      <button 
        className={currentFilter === 'completed' ? 'active' : ''} 
        onClick={() => setFilter('completed')}
      >
        Completed
      </button>
    </div>
  );
}

export default TaskFilter;
