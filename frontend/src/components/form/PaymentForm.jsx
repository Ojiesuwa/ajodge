import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, CreditCard, User, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import SuccessModal from '../modals/SuccessModal';
import ErrorModal from '../modals/ErrorModal';
import Button from '../ui/Button';

const PaymentForm = () => {
    const [searchParams] = useSearchParams();
    const ssid = searchParams.get('ssid');

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [selectedMember, setSelectedMember] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // if (!ssid) {
        //     setError('Invalid session ID. Please ensure the link is correct.');
        //     setLoading(false);
        //     return;
        // }

        const fetchMembers = async () => {
            try {
                const response = await apiService.getSessionMembers(ssid);
                if (response && response.members) {
                    setMembers(response.members);
                } else {
                    setError('No members found for this session');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch members');
            } finally {
                setLoading(false);
            }
        };

        // fetchMembers();
    }, [ssid]);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!selectedMember) {
            setErrorMessage('Please select a member first');
            setShowErrorModal(true);
            return;
        }

        setIsSubmitting(true);
        try {
            // Mock payment API call as requested
            await new Promise(resolve => setTimeout(resolve, 1500));
            setShowSuccessModal(true);
        } catch (err) {
            setErrorMessage('Payment failed. Please try again.');
            setShowErrorModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentMember = members.find(m => m.memberId === selectedMember);
    const amountToPay = currentMember ? currentMember.payment : 0;

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"
                />
            </div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md mx-auto bg-white p-6 md:p-8 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100"
                style={{ fontFamily: '"Inter", sans-serif' }}
            >
                <div className="mb-8 text-center pt-4">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: '"Tasa Orbita", sans-serif' }}>
                        Ajo Payment
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                        Select your profile to complete your payment
                    </p>
                </div>

                {error ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 p-4 bg-red-50 rounded-md border border-red-100 flex items-start text-red-600 text-sm"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0 mr-3 mt-0.5 text-red-500" />
                        <p className="leading-relaxed">{error}</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handlePayment} className="space-y-6">

                        <div className="relative z-20">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name of Member
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 bg-white border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${isDropdownOpen ? 'border-gray-400 border-b-transparent shadow-sm' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}
                                >
                                    <span className={`block truncate text-base ${!selectedMember ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
                                        {currentMember ? `${currentMember.firstname} ${currentMember.lastname}` : 'Select your name'}
                                    </span>
                                    <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                        <ChevronDown className={`w-5 h-5 text-gray-400`} />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-md py-2 max-h-[240px] overflow-y-auto z-50"
                                        >
                                            {members.map((member) => (
                                                <button
                                                    key={member.memberId}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedMember(member.memberId);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-5 py-3.5 text-sm hover:bg-gray-50 flex items-center transition-colors ${selectedMember === member.memberId ? 'bg-gray-50 text-gray-900 font-bold' : 'text-gray-600'}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-3 ${selectedMember === member.memberId ? 'bg-gray-200' : 'bg-gray-100'}`}>
                                                        <User className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                    <span className="text-base">{member.firstname} {member.lastname}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {currentMember && (
                                <motion.div
                                    key="amount-display"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden z-10 relative"
                                >
                                    <div className="bg-[#f0f3f6] p-8 rounded-md border border-gray-200 text-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-[0.15em] font-semibold">Amount to Pay</p>
                                        <p className="text-5xl font-bold text-gray-900 flex items-center justify-center tracking-tight">
                                            <span className="text-3xl mr-1.5 text-gray-400 font-normal">₦</span>
                                            {amountToPay.toLocaleString()}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-2 z-10 relative">
                            <Button type="submit" isLoading={isSubmitting} className="w-full flex justify-center items-center py-4 rounded-md shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 transition-all font-semibold text-base">
                                <CreditCard className="w-5 h-5 mr-2.5" />
                                Complete Payment
                            </Button>
                        </div>
                    </form>
                )}
            </motion.div>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                errorMessage={errorMessage}
            />
        </>
    );
};

export default PaymentForm;