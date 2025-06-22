import { useContext, useState, useEffect } from 'react';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import PomodoroTimer from './components/PomodoroTimer';
import TaskContext from './contexts/TaskContext';
import Confetti from 'react-confetti';

function App() {
  const { tasks } = useContext(TaskContext);
  const [showConfetti, setShowConfetti] = useState(false);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  useEffect(() => {
    if (progress === 100 && totalTasks > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000); // Confetti for 8 seconds
    }
  }, [progress, totalTasks]);

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300
                 bg-gradient-light dark:bg-gradient-dark">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}
      <div className="flex flex-col md:flex-row min-h-screen bg-white/30 dark:bg-gray-900/30">
        
        {/* Main Content */}
        <main className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-6 lg:p-8">
          <Header />
          <div className="mt-8">
            <AddTaskForm />
            <ProgressBar />
            <TaskList />
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-white/50 dark:bg-gray-800/30 backdrop-blur-xl p-4 md:p-6 lg:p-8 border-l border-gray-200/80 dark:border-gray-700/60">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Focus Zone</h2>
          <PomodoroTimer />
        </aside>

      </div>
    </div>
  )
}

export default App 