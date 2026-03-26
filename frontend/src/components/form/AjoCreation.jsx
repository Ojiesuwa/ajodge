import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";
import { apiService } from "../../services/api";
import SuccessModal from "../modals/SuccessModal";

function AjoCreationForm() {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    amount: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const durationOptions = [
    { value: "3_days", label: "3 Days" },
    { value: "1_week", label: "1 Week" },
    { value: "1_month", label: "1 Month" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Ajo name is required";
    if (!formData.duration) newErrors.duration = "Please select a duration";

    // Validate amount
    const amountVal = formData.amount.replace(/,/g, "");
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(amountVal) || Number(amountVal) <= 0) {
      newErrors.amount = "Enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any previous submit error
    if (errors.submit) setErrors(prev => ({ ...prev, submit: '' }));

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const groupChatId = searchParams.get('gcid') || "";
        const messageId = searchParams.get('msid') || "";

        // Send numeric amount without commas
        const amountVal = formData.amount.replace(/,/g, "");

        // Ensure duration mapped to label if necessary, but using raw value as per instructions
        const durationOptionsObj = durationOptions.find(o => o.value === formData.duration);
        const timeFrameLabel = durationOptionsObj ? durationOptionsObj.label : formData.duration;

        const payload = {
          groupChatId,
          sessionName: formData.name,
          timeFrame: timeFrameLabel, // sending label (e.g. "30 Days") as requested by example
          amountPerPerson: amountVal,
          messageId
        };

        await apiService.createAjoSession(payload);

        setIsSubmitting(false);
        setShowSuccess(true);
      } catch (error) {
        console.error("Failed to create Ajo session:", error);
        setIsSubmitting(false);
        setErrors(prev => ({ ...prev, submit: error.message || "We couldn't setup your Ajo group right now. Please test your connection and try again." }));
      }
    }
  };

  const handleAmountChange = (e) => {
    // Basic formatting for comma separated numbers
    const rawValue = e.target.value.replace(/,/g, '').replace(/\D/g, '');
    if (!rawValue) {
      setFormData({ ...formData, amount: '' });
      return;
    }
    const formatted = Number(rawValue).toLocaleString('en-US');
    setFormData({ ...formData, amount: formatted });

    // Clear error on change
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  // Select dropdown state
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for premium feel
        staggerChildren: 0.1,
      },
    },
  };
  // Variants for Framer motion
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 min-h-screen flex items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 md:p-8"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-semibold text-gray-900 mb-2">
            Create your Ajo
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Set up the details for your new savings group. Let's make saving seamless.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Name of Ajo
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g: Ajo January"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                className={`w-full px-4 py-3.5 bg-gray-50/50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200 ${errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200"}`}
              />
            </div>
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="text-red-500 text-xs flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Duration Dropdown */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ajo Duration
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className={`w-full px-4 py-3.5 bg-gray-50/50 border rounded-xl text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200 ${errors.duration ? "border-red-300" : "border-gray-200"} ${formData.duration ? "text-gray-900" : "text-gray-400"} ${isSelectOpen ? "border-brand ring-2 ring-brand/20 bg-white" : ""}`}
              >
                {formData.duration ? durationOptions.find(o => o.value === formData.duration)?.label : 'Select duration'}
                <motion.div
                  animate={{ rotate: isSelectOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isSelectOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2 overflow-hidden"
                  >
                    {durationOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, duration: option.value });
                          setIsSelectOpen(false);
                          if (errors.duration) setErrors(prev => ({ ...prev, duration: '' }));
                        }}
                        className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-between group"
                      >
                        {option.label}
                        {formData.duration === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-brand" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {errors.duration && (
                <motion.p
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="text-red-500 text-xs flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.duration}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Amount Input */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Amount per Person
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium sm:text-lg">₦</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="30,000"
                value={formData.amount}
                onChange={handleAmountChange}
                className={`w-full pl-10 pr-4 py-3.5 bg-gray-50/50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200 font-medium ${errors.amount ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200"}`}
              />
            </div>
            <AnimatePresence>
              {errors.amount && (
                <motion.p
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="text-red-500 text-xs flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.amount}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <AnimatePresence>
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-2 border border-red-100"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{errors.submit}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full relative py-4 bg-brand hover:bg-brand-dark text-gray-900 font-semibold rounded-xl overflow-hidden transition-colors disabled:opacity-80 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(1,255,117,0.39)] hover:shadow-[0_6px_20px_rgba(1,255,117,0.23)]"
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                    <span>Processing...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="continue-button"
                  >
                    Continue
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </form>
      </motion.div>      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)} 
        title="Ajo Created!"
        subtitle="Your savings group has been successfully set up. Time to start inviting members."
      />
    </div>
  );
}

export default AjoCreationForm;
