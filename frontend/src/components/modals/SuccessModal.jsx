import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successConfetti from '../../animations/success confetti.lottie';
import successCheck from '../../animations/success.lottie';

const SuccessModal = ({ 
    isOpen, 
    onClose, 
    validationCode,
    title = "Registration completed",
    subtitle = "Congratulations! Your account details have been successfully verified and registered with Ajodge." 
}) => {
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
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 p-4 outline-none"
                    >
                        <div className="relative flex flex-col items-center overflow-hidden rounded-[24px] bg-white pt-10 pb-8 px-6 shadow-2xl">
                            {/* Confetti Background Layer */}
                            <div className="absolute top-0 left-0 w-full h-[220px] pointer-events-none opacity-80" style={{ transform: 'scale(1.1)', transformOrigin: 'top center' }}>
                                <DotLottieReact src={successConfetti} autoplay loop={false} />
                            </div>

                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 z-20 rounded-full p-2 text-gray-400 focus:outline-none hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Checkmark Animation */}
                            <div className="relative z-10 mb-4 h-24 w-24">
                                <DotLottieReact src={successCheck} autoplay loop={false} />
                            </div>

                            <h2 className="relative z-10 mb-3 text-center text-[26px] font-bold text-gray-900 font-heading">
                                {title}
                            </h2>
                            <p className="relative z-10 text-center text-[15px] leading-relaxed text-gray-500 mb-8 max-w-[320px]">
                                {subtitle}
                            </p>

                            {validationCode && (
                                <div className="relative z-10 w-full rounded-2xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden bg-white max-w-[350px] mx-auto transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                                    {/* Grey Header Area */}
                                    <div className="bg-[#f0f0f3] px-4 py-3.5 flex items-center gap-3 border-b border-gray-100/50">
                                        <div className="flex items-center justify-center w-[34px] h-[34px] rounded-xl bg-orange-50 text-orange-600 shadow-sm shrink-0 border border-orange-100/50">
                                            {/* Minimal Key / Lock icon representing validation code */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                                        </div>
                                        <span className="font-semibold text-gray-900 text-[15px] tracking-tight text-left leading-none mt-0.5">
                                            Validation Code
                                        </span>
                                    </div>
                                    
                                    {/* White Content Area */}
                                    <div className="p-4 bg-white flex flex-col gap-3.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-800 font-semibold text-[15px] flex items-center gap-1.5">
                                                Copy code <span className="text-[16px] leading-none">🔐</span>
                                            </span>
                                            <button
                                                onClick={copyToClipboard}
                                                className="shrink-0 p-1.5 -mr-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                                                title="Copy to clipboard"
                                            >
                                                {copied ? (
                                                    <Check className="w-[18px] h-[18px] text-brand-hover" />
                                                ) : (
                                                    <Copy className="w-[18px] h-[18px]" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="group relative">
                                            <div className="absolute inset-0 bg-gray-50 rounded-xl transition-colors group-hover:bg-gray-100/80" />
                                            <code className="relative block px-3.5 py-3 text-[14px] font-mono font-medium text-gray-700 break-all text-left">
                                                {validationCode}
                                            </code>
                                        </div>
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
