import { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggler = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.button
        key={theme}
        onClick={toggleTheme}
        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-gray-800 transition-colors"
        aria-label="Toggle theme"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
      </motion.button>
    </AnimatePresence>
  );
};

export default ThemeToggler; 