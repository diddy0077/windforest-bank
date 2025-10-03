import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../components/UserContext';

const AdminLogin = () => {
  // State to manage input values and UI submission feedback
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nav = useNavigate()
  const { login } = useContext(UserContext);
  

  // Placeholder function for form submission (no actual logic)
const handleSubmit = (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const validEmail = "admin@dashboard.com";
  const validPassword = "admin";

 if (username.toLowerCase().trim() === validEmail && password.trim() === validPassword) {
  const adminUser = {
    id: "admin-001",
    role: "admin",
    email: validEmail,
    fullName: "System Admin",
  };

   setTimeout(() => {
    login(adminUser); 
    nav("/admin");
  },2000)
} else {
  toast.error("Invalid Email or password!");
}
  setTimeout(() => {
    setIsSubmitting(false);
  }, 1500);
};


  // Icon for the Admin Panel (Styled in Red-400)
  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto text-red-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-inter">
      
      {/* Login Card Container */}
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">

        <header className="text-center mb-8">
          <LockIcon />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Please log in with your credentials.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          
          {/* Username/Email Field */}
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@dashboard.com"
              required
              // Input styling uses gray for background and borders, white for text
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 placeholder-gray-400"
            />
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              // Input styling uses gray for background and borders, white for text
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 placeholder-gray-400"
            />
            {/* Simple link for UI purposes, styled in Red-400 */}
            <div className="text-right mt-2">
                <a href="#" className="text-xs text-red-400 hover:text-red-300 transition duration-150">
                    Forgot Password?
                </a>
            </div>
          </div>

          {/* Login Button - Primary Brand Color: Red-600 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              // Simple loading spinner UI
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Secure Login'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
