import React from 'react';
import { Link } from 'react-router-dom';

// Mock Icons
const LockIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z"></path>
    </svg>
);



const LoginRequiredCard = ({isOpen,setIsOpen}) => {
    return (
        <div className={`${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
        } flex justify-center items-center min-h-screen font-sans fixed h-screen inset-0 z-40 transition-all duration-300`}>
        <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      ></div>

            <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl text-center border-t-8 border-red-600 relative z-40 mx-4">
                <button onClick={() => setIsOpen(false)} className='absolute top-4 right-4'>
                    <svg className='fill-red-600' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </button>
                {/* Icon */}
                <div className="mx-auto text-red-600 mb-4 flex justify-center">
                    <LockIcon />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Login Required
                </h2>
                
                <p className="text-gray-600 mb-6">
                    To proceed with a loan application, please sign in to your WindForest Bank account first.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link
                        to="/"
                        className="block w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors"
                    >
                        Sign In Now
                    </Link>
                    <Link
                        to="/account-types"
                        className="block w-full py-3 border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        New User? Enroll Here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginRequiredCard;
