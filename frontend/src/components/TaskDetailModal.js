// src/components/TaskDetailModal.js

import React from 'react';
import './TaskDetailModal.css';

const TaskDetailModal = ({ task, onClose }) => {
  // Function to handle click outside the modal to close it
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();  // Close modal when clicking on the overlay
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>×</span>
        <h2>{task.title}</h2>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Priority:</strong> <span className={`priority-${task.priority.toLowerCase()}`}>{task.priority}</span></p>
        <p><strong>Status:</strong> <span className={`status-${task.status.toLowerCase()}`}>{task.status}</span></p>
        <p><strong>Category:</strong> {task.category}</p>
      </div>
    </div>
  );
};

export default TaskDetailModal;
