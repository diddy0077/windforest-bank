import React from "react";

export default function TransferSuccessModal({ isOpen, onClose, amount, recipient }) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300`}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="bg-white rounded-2xl mx-4 shadow-2xl w-full max-w-md p-6 relative z-10 transform transition-all duration-500 scale-100">
        
        {/* Success Animation */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Modal Content */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Transfer Successful!</h2>
        <p className="text-center text-gray-600 mb-4">
          You have successfully transferred <span className="font-semibold text-red-600">{Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span> to <span className="font-semibold">{recipient}</span>.
        </p>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 cursor-pointer py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
