import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  to?: string;
  type: 'primary' | 'small' | 'round' | 'secondary';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function Button({ children, disabled, to, type, onClick }: ButtonProps) {
  const base =
    'inline-block text-sm rounded-full bg-pizza-500 font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-pizza-400 focus:bg-pizza-400 focus:outline-none focus:ring focus:ring-pizza-300 focus:ring-offset-2 disabled:cursor-not-allowed';

  const styles = {
    primary: base + ' px-4 py-3 md:px-6 md:py-4',
    small: base + ' px-4 py-2 md:px-5 md:py-2.5 text-xs',
    round: base + ' px-2.5 py-1 md:px-3.5 md:py-2 text-sm',
    secondary:
      'inline-block text-sm rounded-full border-2 border-stone-300 dark:border-stone-700 font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500 transition-all duration-300 hover:bg-stone-300 dark:hover:bg-stone-700 hover:text-stone-800 dark:hover:text-stone-100 focus:bg-stone-300 focus:text-stone-800 focus:outline-none focus:ring focus:ring-stone-200 focus:ring-offset-2 disabled:cursor-not-allowed px-4 py-2.5 md:px-6 md:py-3.5',
  };

  const motionProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };

  if (to)
    return (
      <Link to={to} className={styles[type]}>
        <motion.span className="inline-block" {...motionProps}>
          {children}
        </motion.span>
      </Link>
    );

  if (onClick)
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        <motion.div className="inline-block" {...motionProps}>
          {children}
        </motion.div>
      </button>
    );

  return (
    <button disabled={disabled} className={styles[type]}>
      <motion.div className="inline-block" {...motionProps}>
        {children}
      </motion.div>
    </button>
  );
}

export default Button;
