import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';
import TaskDetailModal from './TaskDetailModal';  // Import the modal component
import './Tasks.css';

const Tasks = () => {
  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTask, setExpandedTask] = useState(null);
  const [filter, setFilter] = useState({ priority: '', status: '', dueDate: '' });
  const [fetchData, { loading }] = useFetch();
  const [showModal, setShowModal] = useState(false);  // State to manage modal visibility
  const [selectedTask, setSelectedTask] = useState(null);  // Store selected task for modal

  const fetchTasks = useCallback(() => {
    const config = { url: '/tasks', method: 'get', headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => {
      if (data.tasks) setTasks(data.tasks);
    });
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: 'delete', headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  };

  const toggleCompletion = (task) => {
    const updatedTask = { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' };
    const config = { url: `/tasks/${task._id}`, method: 'put', data: updatedTask, headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  };

  const handleExpand = (task) => {
    setSelectedTask(task);  // Store task for modal
    setShowModal(true);  // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false);  // Close the modal
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredTasks = tasks.filter(task =>
    (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filter.priority ? task.priority === filter.priority : true) &&
    (filter.status ? task.status === filter.status : true) &&
    (filter.dueDate ? task.dueDate?.startsWith(filter.dueDate) : true)
  );

  return (
    <div className="tasks-container">
      <h2 className="tasks-header">Your tasks ({filteredTasks.length})</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search tasks..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select name="priority" onChange={handleFilterChange} className="filter-select">
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select name="status" onChange={handleFilterChange} className="filter-select">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input type="date" name="dueDate" onChange={handleFilterChange} className="filter-date" />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="tasks-grid">
          {filteredTasks.length === 0 ? (
            <div className="tasks-empty">
              <span>No tasks found</span>
              <Link to="/tasks/add" className="add-task-button">+ Add new task</Link>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task._id} className={`task-item ${task.status.toLowerCase()}`}>
                <div className="task-header">
                  <span className="task-title" onClick={() => handleExpand(task)}>
                    {task.title}
                  </span>
                  <div className="task-actions">
                    <Tooltip text="Toggle Completion" position="top">
                      <span className="task-toggle" onClick={() => toggleCompletion(task)}>
                        {task.status === 'Completed' ? '✅' : '🔲'}
                      </span>
                    </Tooltip>
                    <Tooltip text="Edit this task" position="top">
                      <Link to={`/tasks/${task._id}`} className="task-edit">
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>
                    <Tooltip text="Delete this task" position="top">
                      <span className="task-delete" onClick={() => handleDelete(task._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Tasks;
