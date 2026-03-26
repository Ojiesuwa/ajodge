import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';

const ErrorModal = ({ isOpen, onClose, title = "Oops! Something went wrong", errorMessage = "We couldn't process your request right now. Please try again." }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 p-4 outline-none"
          >
            <motion.div 
              animate={{ x: [0, -10, 10, -10, 10, -4, 4, 0] }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="relative flex flex-col items-center overflow-hidden rounded-2xl bg-white p-8 shadow-2xl"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mt-4">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>

              <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
                {title}
              </h2>
              <p className="text-center text-sm text-gray-500 mb-6 font-medium">
                {errorMessage}
              </p>

              <button
                onClick={onClose}
                className="w-full rounded-md bg-red-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default ErrorModal;
