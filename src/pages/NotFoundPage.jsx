import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Custom SVG Icon (Simulating Lucide Icon for Alert)
 */
const AlertTriangleIcon = ({ className = "w-16 h-16" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);


/**
 * Wind Forest Bank Custom 404 Error Page
 * Uses a light theme (white/gray) with red-600 accents.
 */
const NotFoundPage = () => {
  return (
    // Light Theme Background
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
      
      {/* Centered Content Container */}
      <div className="max-w-xl text-center bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <AlertTriangleIcon className="w-16 h-16 text-red-600" />
        </div>

        {/* The prominent 404 number in brand red */}
        <h1 className="text-8xl font-extrabold tracking-tight text-red-600 mb-4 sm:text-9xl">
          404
        </h1>
        
        {/* Main Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:text-4xl">
          Page Not Found
        </h2>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Oops! It looks like you've ventured into the deep woods. The page you were looking for might have been moved, deleted, or never existed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          
          {/* Primary Button: Go Home (Red-600) */}
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
          >
            Go to Homepage
          </Link>

          {/* Secondary Button: Contact/Support (Gray) */}
          <Link
            to="/contact" // Replace with actual contact page URL
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
          >
            Contact Support
          </Link>
        </div>
        
        {/* Footer Links */}
        <p className="text-sm text-gray-500 mt-8">
          Need help? Try our main links: 
          <Link to="/atm-locations" className="text-red-600 hover:text-red-700 font-medium ml-2">ATMs & Locations</Link>
        </p>
      </div>
      
    </div>
  );
};

export default NotFoundPage;
