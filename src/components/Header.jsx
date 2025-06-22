import { useContext } from 'react';
import ThemeToggler from './ThemeToggler';
import ThemeContext from '../contexts/ThemeContext';

const Header = () => {
  const { theme } = useContext(ThemeContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
          Smart Daily Planner
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{getGreeting()}</p>
      </div>
      <ThemeToggler />
    </header>
  );
};

export default Header; 