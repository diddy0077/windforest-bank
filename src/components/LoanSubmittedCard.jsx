import React from 'react';
import { Link } from 'react-router-dom';

// Mock Icon for success
const CheckCircleIcon = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);


const LoanSubmittedCard = ({ confirm, setConfirm, selectedLoan }) => {
    const applicationID = "WFB-2024-5832";
    const reviewTime = "1-2 business days";

    return (
        <div className={`${
        confirm
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
        } flex justify-center items-center min-h-screen font-sans fixed h-screen inset-0 z-40 transition-all duration-300`}>
        <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setConfirm(false)}
      ></div>
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl text-center border-t-8 border-red-600 relative z-40">
                
                {/* Success Icon */}
                <div className="mx-auto text-red-600 mb-6 flex justify-center">
                    <CheckCircleIcon className="w-16 h-16"/>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Application Submitted!
                </h2>
                
                {selectedLoan && <p className="text-gray-600 mb-6">
                    Thank you for applying for a <strong>{selectedLoan?.name}</strong> with WindForest Bank.
                </p>}

                {/* Summary Box */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                    <div className="text-left space-y-3">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-900 block">Application ID:</span>
                            <span className="text-red-600 font-mono text-lg">{applicationID}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-900 block">Next Steps:</span>
                            We are currently reviewing your details.
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-900 block">Estimated Review Time:</span>
                            You will receive an update within **{reviewTime}**.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to='/account-dashboard'
                        className="w-full py-3 bg-red-600 text-white font-bold rounded-full shadow-md hover:bg-red-700 transition-colors"
                    >
                        Go to Dashboard
                    </Link>
                    
                </div>
            </div>
        </div>
    );
};

export default LoanSubmittedCard;
