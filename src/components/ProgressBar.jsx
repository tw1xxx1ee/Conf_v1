import { useContext } from 'react';
import TaskContext from '../contexts/TaskContext';
import { motion } from 'framer-motion';

const ProgressBar = () => {
  const { tasks } = useContext(TaskContext);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <motion.div
          className="bg-indigo-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      <div className="text-center mt-2 text-sm text-gray-500">
        {completedTasks} of {totalTasks} tasks completed
      </div>
    </div>
  );
};

export default ProgressBar; 