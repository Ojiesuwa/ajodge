import React from 'react';
import { motion } from 'motion/react';

const Input = React.forwardRef(({ label, id, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <motion.div
        whileTap={{ scale: 0.995 }}
        className="relative"
      >
        <input
          ref={ref}
          id={id}
          className={`w-full px-4 py-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'}
          `}
          {...props}
        />
      </motion.div>
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
