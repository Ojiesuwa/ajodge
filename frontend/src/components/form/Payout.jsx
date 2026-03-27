import React, { useState } from 'react';
import Button from '../ui/Button';
import { apiService } from '../../services/api';
import SuccessModal from '../modals/SuccessModal';

const PayoutButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handlePayout = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.payout();
            console.log(response.message);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Payout failed:", error);
            if (error.message) {
                console.log(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center p-4">
            <Button onClick={handlePayout} isLoading={isLoading}>
                Payout
            </Button>

            <SuccessModal
                isOpen={showSuccessModal}
                title="Payout"
                subtitle="Payout successful"
                message="Payout successful"
                onClose={() => setShowSuccessModal(false)}
            />
        </div>
    );
};

export default PayoutButton;