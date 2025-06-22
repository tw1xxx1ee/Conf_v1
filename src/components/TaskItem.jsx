import { useContext, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskContext from '../contexts/TaskContext';
import { motion } from 'framer-motion';
import { Trash2, GripVertical, Check, X, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';

const priorityColors = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-blue-500',
};

const PriorityPicker = ({ task, onSave }) => {
    const { updateTaskPriority } = useContext(TaskContext);
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({});
    
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const handleSelect = (priority) => {
        updateTaskPriority(task.id, priority);
        setIsOpen(false);
        if(onSave) onSave();
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isOpen && menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen]);

    useLayoutEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuWidth = 128; // w-32
            setCoords({
                top: rect.bottom + window.scrollY + 8,
                left: rect.right + window.scrollX - menuWidth,
            });
        }
    }, [isOpen]);

    const DropdownMenu = (
        <motion.div
            ref={menuRef}
            style={{
                position: 'absolute',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-50 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg border dark:border-gray-600"
        >
            <a onClick={() => handleSelect('high')} className="flex justify-between items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">High <div className="w-3 h-3 rounded-full bg-red-500"></div></a>
            <a onClick={() => handleSelect('medium')} className="flex justify-between items-center px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Medium <div className="w-3 h-3 rounded-full bg-yellow-500"></div></a>
            <a onClick={() => handleSelect('low')} className="flex justify-between items-center px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Low <div className="w-3 h-3 rounded-full bg-blue-500"></div></a>
        </motion.div>
    );

    return (
        <>
            <button ref={buttonRef} onClick={() => setIsOpen(prev => !prev)} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                {task.priority}
                <ChevronDown size={14} />
            </button>
            {isOpen && createPortal(DropdownMenu, document.body)}
        </>
    );
};

const TaskItem = ({ task }) => {
  const { deleteTask, toggleTaskCompletion, editTask } = useContext(TaskContext);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);
  const inputRef = useRef(null);
  const completeAudioRef = useRef(new Audio('/complete.mp3'));
  const deleteAudioRef = useRef(new Audio('/delete.mp3'));

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id);
    if (!task.completed) {
      completeAudioRef.current.currentTime = 0;
      completeAudioRef.current.play();
    }
  };

  const handleDelete = () => {
    deleteAudioRef.current.currentTime = 0;
    deleteAudioRef.current.play();
    deleteTask(task.id);
  };

  const handleSave = () => {
    if (editText.trim()) {
      editTask(task.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.title);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      layout
      variants={itemVariants}
      className={`flex items-center group p-3 mb-2 rounded-lg shadow-sm transition-all duration-200 border-l-4
        ${task.completed ? 'bg-emerald-100/70 dark:bg-emerald-900/40 opacity-60' : `bg-white dark:bg-gray-800 ${priorityColors[task.priority] || priorityColors.medium}`}
        hover:shadow-md hover:scale-[1.02]`}
    >
      <div {...listeners} className="cursor-grab touch-none p-2 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300">
        <GripVertical size={20} />
      </div>

      <div className="relative flex items-center justify-center mr-4">
        <input
          id={`task-${task.id}`}
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleCompletion}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-400 dark:border-gray-500 transition-all checked:border-sky-500 checked:bg-sky-500"
        />
        <div className="pointer-events-none absolute text-white opacity-0 transition-opacity peer-checked:opacity-100">
          <Check size={14} />
        </div>
      </div>

      <div className="flex-grow">
        {!isEditing ? (
          <label 
            htmlFor={`task-${task.id}`}
            onDoubleClick={() => !task.completed && setIsEditing(true)}
            className={`font-medium truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200 cursor-pointer'}`}
          >
            {task.title}
          </label>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-b-2 border-sky-500 focus:outline-none text-gray-800 dark:text-gray-200"
          />
        )}
      </div>

      <div className="flex items-center ml-4">
        {!isEditing && <PriorityPicker task={task} />}
        <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="p-1 text-green-500 hover:text-green-700"><Check size={20} /></button>
              <button onClick={handleCancel} className="p-1 text-red-500 hover:text-red-700"><X size={20} /></button>
            </>
          ) : (
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem; 