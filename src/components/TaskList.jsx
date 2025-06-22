import { useContext, useMemo, useState } from 'react';
import TaskContext from '../contexts/TaskContext';
import TaskItem from './TaskItem';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, ListTodo, SortAsc } from 'lucide-react';

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="text-center py-10 px-4"
  >
    <ListTodo size={48} className="mx-auto text-gray-400 dark:text-gray-500" />
    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No tasks yet</h3>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a task to get started!</p>
  </motion.div>
);

const TaskList = () => {
  const { tasks, filter, setFilter, updateTaskOrder, clearCompleted } = useContext(TaskContext);
  const [isSorting, setIsSorting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      updateTaskOrder(active.id, over.id);
    }
  };

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const filteredTasks = useMemo(() => {
    const baseTasks = tasks.filter(task => {
      if (filter === 'all') return true;
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });

    if (isSorting) {
      return [...baseTasks].sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));
    }
    return baseTasks;

  }, [tasks, filter, isSorting]);

  const hasCompletedTasks = tasks.some(task => task.completed);

  return (
    <div className="bg-gray-100/50 dark:bg-gray-900/50 p-4 rounded-xl shadow-inner h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <button onClick={() => setFilter('all')} className={`text-sm font-medium ${filter === 'all' ? 'text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'}`}>All</button>
          <button onClick={() => setFilter('active')} className={`text-sm font-medium ${filter === 'active' ? 'text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'}`}>Active</button>
          <button onClick={() => setFilter('completed')} className={`text-sm font-medium ${filter === 'completed' ? 'text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'}`}>Completed</button>
        </div>
        <div className="flex items-center gap-4">
           <button 
            onClick={() => setIsSorting(prev => !prev)}
            className={`flex items-center gap-1 text-sm font-medium p-1 rounded-md transition-colors
              ${isSorting ? 'bg-sky-100 text-sky-600 dark:bg-sky-900/70 dark:text-sky-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
           >
             <SortAsc size={16} />
             Sort
           </button>
          {hasCompletedTasks && (
            <button onClick={clearCompleted} className="text-sm font-medium text-red-500 dark:text-red-400 hover:underline">
              Clear Completed
            </button>
          )}
        </div>
      </div>
      <div className="overflow-y-auto overflow-x-hidden flex-grow pr-2">
        {filteredTasks.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              <AnimatePresence>
                {filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </AnimatePresence>
            </SortableContext>
          </DndContext>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default TaskList; 