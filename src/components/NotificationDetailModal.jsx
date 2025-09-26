import React from "react";

export default function NotificationDetailModal({ isOpen, onClose, notification }) {
  if (!notification) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative z-10 bg-white mx-4 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        <p className="text-gray-700 mb-4">{notification.message}</p>

        <p className="text-xs text-gray-400">
          Date: {new Date(notification.date).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
