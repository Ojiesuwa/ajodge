import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';

const ErrorModal = ({ isOpen, onClose, errorMessage = "Something went wrong. Please try again." }) => {
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
            <div className="relative flex flex-col items-center overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
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
                Registration Failed
              </h2>
              <p className="text-center text-sm text-gray-500 mb-6">
                {errorMessage}
              </p>

              <div className="w-full bg-gray-50 p-4 rounded-md border border-gray-100 mb-6 flex justify-center items-center text-sm text-gray-400 italic">
                {/* Note: User will provide the actual component here later */}
                [Registration Failed Component Placeholder]
              </div>

              <button
                onClick={onClose}
                className="w-full rounded-md bg-red-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default ErrorModal;
