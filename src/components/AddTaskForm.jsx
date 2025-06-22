import { useState, useContext } from 'react';
import TaskContext from '../contexts/TaskContext';
import { Plus } from 'lucide-react';

const AddTaskForm = () => {
  const [title, setTitle] = useState('');
  const { addTask } = useContext(TaskContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex items-center gap-2 mt-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 flex items-center justify-center"
        aria-label="Add Task"
      >
        <Plus size={24} />
      </button>
    </form>
  );
};

export default AddTaskForm; 