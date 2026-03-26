import React, { useState } from 'react';
import { motion } from 'motion/react';
import Input from '../ui/Input';
import SearchableSelect from '../ui/SearchableSelect';
import Button from '../ui/Button';
import SuccessModal from '../modals/SuccessModal';
import ErrorModal from '../modals/ErrorModal';
import { apiService } from '../../services/api';
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nin: '',
        accountNumber: '',
        bankId: '',
        bankName: '',
    });

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('ssid');

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal states
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [validationCode, setValidationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // NIN Validation states
    const [isNinVerifying, setIsNinVerifying] = useState(false);
    const [ninVerificationMessage, setNinVerificationMessage] = useState('');
    const [isNameDisabled, setIsNameDisabled] = useState(false);

    React.useEffect(() => {
        const verifyNIN = async () => {
            if (!formData.firstName.trim() || !formData.lastName.trim()) {
                setErrors(prev => ({ ...prev, nin: "First and Last name required for NIN verification" }));
                return;
            }

            setIsNinVerifying(true);
            setNinVerificationMessage('');
            try {
                const response = await apiService.verifyNin({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    nin: formData.nin
                });

                if (response?.data?.status?.status?.toLowerCase() === 'verified' &&
                    response.data.summary?.nin_check?.fieldMatches?.firstname &&
                    response.data.summary?.nin_check?.fieldMatches?.lastname) {

                    setNinVerificationMessage('NIN verified successfully');

                    setFormData(prev => ({
                        ...prev,
                        firstName: response.data.nin.firstname || prev.firstName,
                        lastName: response.data.nin.lastname || prev.lastName
                    }));
                    setIsNameDisabled(true);
                    if (errors.nin) {
                        setErrors(prev => ({ ...prev, nin: undefined }));
                    }
                } else {
                    setErrors(prev => ({ ...prev, nin: "NIN Verification Failed. Details did not match." }));
                }
            } catch (err) {
                setErrors(prev => ({ ...prev, nin: err.message || "We couldn't verify your NIN right now. Please test your network connection and try again." }));
            } finally {
                setIsNinVerifying(false);
            }
        };

        if (formData.nin.length === 11 && !isNameDisabled) {
            verifyNIN();
        } else if (formData.nin.length > 0 && formData.nin.length < 11) {
            setIsNameDisabled(false);
            setNinVerificationMessage('');
        }
    }, [formData.nin]);

    // Account Verification states
    const [isAccountVerifying, setIsAccountVerifying] = useState(false);
    const [accountVerificationMessage, setAccountVerificationMessage] = useState('');
    const [verifiedAccountName, setVerifiedAccountName] = useState('');

    React.useEffect(() => {
        const verifyAccount = async () => {
            if (!formData.bankId) {
                setErrors(prev => ({ ...prev, accountNumber: "Please select a bank first" }));
                return;
            }

            setIsAccountVerifying(true);
            setAccountVerificationMessage('');
            setVerifiedAccountName('');
            try {
                const response = await apiService.verifyAccountNumber({
                    accountNumber: formData.accountNumber,
                    bankCode: formData.bankId
                });

                if (response?.data?.status === 'found' && response?.data?.allValidationPassed === true) {
                    setAccountVerificationMessage('Account verified successfully');
                    setVerifiedAccountName(response.data.bankDetails.accountName);
                    if (errors.accountNumber) {
                        setErrors(prev => ({ ...prev, accountNumber: undefined }));
                    }
                } else {
                    setErrors(prev => ({ ...prev, accountNumber: "Account Verification Failed. Invalid account details." }));
                }
            } catch (err) {
                setErrors(prev => ({ ...prev, accountNumber: err.message || "We couldn't verify your account right now. Please test your network connection and try again." }));
            } finally {
                setIsAccountVerifying(false);
            }
        };

        if (formData.accountNumber.length === 10) {
            verifyAccount();
        } else if (formData.accountNumber.length > 0 && formData.accountNumber.length < 10) {
            setAccountVerificationMessage('');
            setVerifiedAccountName('');
        }
    }, [formData.accountNumber, formData.bankId]);

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

        if (!formData.nin.trim()) {
            newErrors.nin = 'NIN is required';
        } else if (formData.nin.length < 11) {
            newErrors.nin = 'NIN must be at least 11 digits';
        }

        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber = 'Account number is required';
        } else if (formData.accountNumber.length !== 10) {
            newErrors.accountNumber = 'Account number must be 10 digits';
        }

        if (!formData.bankId) newErrors.bankId = 'Please select a bank';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        // For number fields, only allow numbers
        if ((id === 'nin' || id === 'accountNumber') && value !== '' && !/^\d+$/.test(value)) {
            return;
        }
        setFormData((prev) => ({ ...prev, [id]: value }));
        // Clear error for this field
        if (errors[id]) {
            setErrors((prev) => ({ ...prev, [id]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            await pushUserData();
        } catch (error) {
            console.error("Submission failed:", error);
            setErrorMessage(error.message || "We encountered an unexpected issue while signing you up. Please double-check your details and try again.");
            setShowErrorModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    //POST USER INFORMATION
    async function pushUserData() {
        const payload = {
            lastname: formData.lastName,
            firstname: formData.firstName,
            nin: formData.nin,
            accountNumber: formData.accountNumber,
            bankCode: formData.bankId,
            bankName: formData.bankName,
            sessionId: sessionId
        };

        const data = await apiService.registerUser(payload);

        if (data.validationCode && data.message && data.message.toLowerCase().includes("succes")) {
            setValidationCode(data.validationCode);
            setShowSuccessModal(true);
        }
        else {
            setErrorMessage(data.message || "We couldn't complete your registration right now. Please try again.");
            setShowErrorModal(true);
        }
        return data;
    }

    return (
        <>
            <motion.form
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSubmit}
                className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:border sm:border-gray-100"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight pt-8">Registration Form</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Register now to join your existing Ajo.
                    </p>
                </div>

                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="firstName"
                            label="First name"
                            placeholder="eg; John"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            error={errors.firstName}
                            disabled={isNameDisabled}
                        />
                        <Input
                            id="lastName"
                            label="Last name"
                            placeholder="eg; Etuk"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            error={errors.lastName}
                            disabled={isNameDisabled}
                        />
                    </div>

                    <div className="relative">
                        <Input
                            id="nin"
                            label="NIN"
                            type="text"
                            inputMode="numeric"
                            placeholder="eg; 12345678910"
                            maxLength={11}
                            value={formData.nin}
                            onChange={handleInputChange}
                            error={errors.nin}
                            disabled={isNinVerifying}
                        />
                        {isNinVerifying && (
                            <p className="text-sm text-gray-500 mt-1 animate-pulse flex items-center gap-2">
                                <Ring2
                                    size="20"
                                    stroke="2"
                                    strokeLength="0.6"
                                    bgOpacity="0"
                                    speed="0.9"
                                    color="black"
                                />
                                Verifying NIN...
                            </p>
                        )}
                        {ninVerificationMessage && (
                            <p className="text-sm text-green-600 mt-1 font-medium">{ninVerificationMessage}</p>
                        )}
                    </div>

                    <SearchableSelect
                        id="bankId"
                        label="Bank name"
                        value={formData.bankId}
                        onChange={(bank) => {
                            setFormData((prev) => ({ ...prev, bankId: bank.id, bankName: bank.name }));
                            if (errors.bankId) setErrors((prev) => ({ ...prev, bankId: undefined }));
                        }}
                        error={errors.bankId}
                    />

                    <div className="relative">
                        <Input
                            id="accountNumber"
                            label="Account number"
                            type="text"
                            inputMode="numeric"
                            placeholder="eg; 0419231718"
                            maxLength={10}
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            error={errors.accountNumber}
                            disabled={isAccountVerifying}
                        />
                        {isAccountVerifying && (
                            <p className="text-sm text-brand mt-1 animate-pulse">Verifying Account...</p>
                        )}
                        {accountVerificationMessage && (
                            <div className="mt-1">
                                <p className="text-sm text-green-600 font-medium">{accountVerificationMessage}</p>
                                <p className="text-sm font-bold text-gray-800 mt-1">{verifiedAccountName}</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button type="submit" isLoading={isSubmitting}>
                            Register
                        </Button>
                    </div>
                </div>
            </motion.form>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                validationCode={validationCode}
            />

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Registration Failed"
                errorMessage={errorMessage}
            />
        </>
    );
};

export default RegistrationForm;
