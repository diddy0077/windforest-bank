import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AccountLinkingSuccess from './AccountLinkingSuccess';

// Mock Icon Component for Visual Appeal (using inline SVG for the verification icon)
const VerifyIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.79 3.033M21 12c0 6.627-5.373 12-12 12S3 18.627 3 12" />
  </svg>
);

const ConfirmMicroDepositsCard = ({ microDepositOne, microDepositTwo, setStep, externalUser }) => {
  console.log(externalUser)
  console.log(microDepositOne)
  const [deposit1, setDeposit1] = useState('');
  const [deposit2, setDeposit2] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  // Helper function to handle dollar/cent input (only allowing digits and one dot)
  const handleAmountChange = (e, setter) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');

    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    setter(value);
  };

  const handleConfirm = async () => {
    if (!deposit1 || !deposit2) {
      // In a real app, use a custom modal, not alert()
      toast.error("Please enter both micro-deposit amounts.");
      return;
    }
    setIsConfirming(true);
    try {
      if (microDepositOne == deposit1 && microDepositTwo == deposit2 || microDepositOne == deposit2 && microDepositTwo == deposit1) {
        console.log('verified!')
        await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success('Account Verified Successfully!')
      } 
      
      setStep(3)
    }
    catch {
      console.log("Error verifying deposits!")
    }
    finally {
      setIsConfirming(false)
    }
  };
 
  


  return (
    
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header Section - Red Accent */}
        <div className="flex items-center p-6 bg-red-600 text-white rounded-t-xl">
          <VerifyIcon className="w-8 h-8 mr-3" />
          <h2 className="text-2xl font-bold tracking-tight">
            Confirm Account Ownership
          </h2>
        </div>

        {/* Instructions/Guidance */}
        <div className="p-8 pb-4 space-y-4">
          <p className="text-gray-700 text-md font-medium">
            **Check your external bank statement** for two small deposits (less than $1.00 each) sent by WindForest Bank.
          </p>
          <p className="text-sm text-gray-500 border-l-4 border-red-300 pl-4 py-2 bg-red-50 rounded-md">
            Enter the exact dollar and cent amounts below to verify your account and complete the linking process.
          </p>
        </div>

        {/* Deposit Inputs */}
        <div className="p-8 pt-4 space-y-6">
          
          {/* Deposit 1 Input */}
          <div>
            <label 
              htmlFor="deposit1" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Micro-Deposit Amount (e.g., 0.15)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input
                type="text"
                id="deposit1"
                value={deposit1}
                onChange={(e) => handleAmountChange(e, setDeposit1)}
                placeholder="0.XX"
                className="w-full p-3 pl-6 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-800 transition duration-300 shadow-sm font-mono"
                disabled={isConfirming}
              />
            </div>
          </div>

          
          <div>
            <label 
              htmlFor="deposit2" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Second Micro-Deposit Amount (e.g., 0.32)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input
                type="text"
                id="deposit2"
                value={deposit2}
                onChange={(e) => handleAmountChange(e, setDeposit2)}
                placeholder="0.XX"
                className="w-full p-3 pl-6 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-800 transition duration-150 shadow-sm font-mono"
                disabled={isConfirming}
              />
            </div>
          </div>

          {/* Confirmation Button - Red-600 Primary Action */}
          <button
            onClick={handleConfirm}
            disabled={isConfirming || !deposit1 || !deposit2}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 transition duration-150 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
          >
            {isConfirming ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isConfirming ? 'Verifying Amounts...' : 'Confirm Deposits & Link Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMicroDepositsCard;
