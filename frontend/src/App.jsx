import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './components/form/RegistrationForm';
import PaymentForm from './components/form/PaymentForm';
import AjoCreationForm from './components/form/AjoCreation';
import './App.css';

function App() {
  return (
    <div className="min-h-screen w-full bg-[#f9fbfc] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Optional decorative background elements can go here */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand/5 blur-[120px]" />
        <div className="absolute top-[60%] -left-[10%] w-[40%] h-[40%] rounded-full bg-brand/5 blur-[100px]" />
      </div>

      <div className="w-full relative z-10">
        <Routes>
          <Route path="/" element={<AjoCreationForm />} />
          <Route path="/ajo-payment" element={<PaymentForm />} />
          <Route path="/ajo-registration" element={<RegistrationForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
