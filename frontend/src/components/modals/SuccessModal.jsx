import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, validationCode }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        if (validationCode) {
            navigator.clipboard.writeText(validationCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
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
                                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-brand-light">
                                {/* Fallback image if success.gif is missing */}
                                <img
                                    src="/success.gif"
                                    alt="Success"
                                    className="h-24 w-24 object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement.innerHTML = '<span class="text-6xl">🎉</span>';
                                    }}
                                />
                            </div>

                            <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
                                Registration Successful
                            </h2>
                            <p className="text-center text-sm text-gray-500 mb-6">
                                Your account details have been successfully verified and registered with Ajo.
                            </p>

                            {validationCode && (
                                <div className="w-full mb-6">
                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Validation Code
                                    </span>
                                    <div className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <code className="text-sm font-mono text-gray-800 break-all pr-2">
                                            {validationCode}
                                        </code>
                                        <button
                                            onClick={copyToClipboard}
                                            className="shrink-0 p-2 ml-2 rounded-md hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-900 focus:outline-none"
                                            title="Copy to clipboard"
                                        >
                                            {copied ? (
                                                <Check className="w-4 h-4 text-brand-hover" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </React.Fragment>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;
