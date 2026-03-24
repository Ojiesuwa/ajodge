import React from 'react';
import { motion } from 'motion/react';

const Button = React.forwardRef(({ children, className = '', isLoading = false, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full overflow-hidden rounded-md bg-brand px-6 py-3.5 text-base font-semibold text-black shadow-sm hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-colors duration-200 ${
        isLoading ? 'opacity-80 cursor-not-allowed' : ''
      } ${className}`}
      disabled={isLoading}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
          />
        ) : (
          children
        )}
      </div>
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
