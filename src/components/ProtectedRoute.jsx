import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { Navigate, Outlet, NavLink } from "react-router-dom";
import { LogOutIcon, DollarSign } from "lucide-react";

const ProtectedRoute = () => {
  const { currentUser, logout, loading } = useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]);
    console.log("ProtectedRoute currentUser:", currentUser); // ← here

  if (loading) {
    return (
      <div className="bg-gray-50">
        <div className="w-15 h-15 rounded-full border border-t-transparent border-5 border-red-600">
          Loading...
        </div>
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen h-full bg-gray-100 font-sans antialiased">
      <div>
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-red-700 text-white p-6 transform transition-transform duration-300 md:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold">WindForest</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="space-y-4">
            <NavLink
              onClick={() => setIsSidebarOpen(false)}
              to="/account-dashboard"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              onClick={() => setIsSidebarOpen(false)}
              to="/account-dashboard/transactions"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Transactions</span>
            </NavLink>
            <NavLink
              onClick={() => setIsSidebarOpen(false)}
              to="/account-dashboard/transfer"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-3.328A1.75 1.75 0 0111 4.5V2.75A1.75 1.75 0 009.25 1h-5A1.75 1.75 0 002.5 2.75V4a2 2 0 002 2zM12 11a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" />
              </svg>
              <span>Transfer & Payments</span>
            </NavLink>
             <NavLink
              to="/account-dashboard/my-loans"
              className={({ isActive }) =>
                `${
                  isActive ? "bg-red-800" : ""
                } flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors`
              }
            >
              <DollarSign className="w-5 h-5" />
              <span>My Loans</span>
            </NavLink>
            <NavLink
              onClick={() => setIsSidebarOpen(false)}
              to="profile"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Profile & Settings</span>
            </NavLink>
           
            <div className="h-px bg-red-600 my-4"></div>
            <button
              onClick={logout}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Sidebar - Desktop */}
        <div className="hidden md:block w-64 bg-red-700 text-white h-full min-h-screen p-6">
          <div className="flex items-center mb-10">
            <h2 className="text-2xl font-bold">WindForest</h2>
          </div>
          <nav className="space-y-4">
            <NavLink
              to="/account-dashboard"
              end
              className={({ isActive }) =>
                `${
                  isActive ? "bg-red-800" : ""
                } flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/account-dashboard/transactions"
              className={({ isActive }) =>
                `${
                  isActive ? "bg-red-800" : ""
                } flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Transactions</span>
            </NavLink>
            <NavLink
              to="/account-dashboard/transfer"
              className={({ isActive }) =>
                `${
                  isActive ? "bg-red-800" : ""
                } flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-3.328A1.75 1.75 0 0111 4.5V2.75A1.75 1.75 0 009.25 1h-5A1.75 1.75 0 002.5 2.75V4a2 2 0 002 2zM12 11a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" />
              </svg>
              <span>Transfer & Payments</span>
            </NavLink>
             <NavLink
              to="/account-dashboard/my-loans"
              className={({ isActive }) =>
                `${
                  isActive ? "bg-red-800" : ""
                } flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors`
              }
            >
              <DollarSign className="w-5 h-5" />
              <span>My Loans</span>
            </NavLink>
            <NavLink
              to="/account-dashboard/profile"
              className={({ isActive }) =>
                `${
                  isActive ? "bg-red-800" : ""
                } flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Profile & Settings</span>
            </NavLink>
           
            <div className="h-px bg-red-600 my-4"></div>
            <button
              onClick={logout}
              className="cursor-pointer flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors"
            >
              <LogOutIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>
      <div className="flex-grow">
        <Outlet
          context={{ setIsSidebarOpen, setNotifications, notifications,transactions,setTransactions }}
        />
      </div>
    </div>
  );
};

export default ProtectedRoute;
