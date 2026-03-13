import React, { useState, useMemo } from "react";
import { Clock, DollarSign, Calendar, TrendingUp, CreditCard, PiggyBank, AlertCircle, CheckCircle } from "lucide-react"; // Using lucide-react for icons
import { useOutletContext } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper function to get status badge styling
const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case "approved":
      return (
        // Standard Green for Approved
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
          Approved
        </span>
      );
    case "pending":
      return (
        // Standard Yellow for Pending
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
          Pending Review
        </span>
      );
    case "paid":
      return (
        // Neutral Gray for Paid/Completed (aligns with brand palette)
        <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-700">
          Paid Off
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800">
          {status}
        </span>
      );
  }
};

// Component for a single row item (used in both desktop table and mobile list)
const LoanItem = ({ loan }) => {
  const formattedDate = new Date(loan.appliedAt).toLocaleDateString();

  // Calculate payment progress (simulated based on time elapsed)
  const appliedDate = new Date(loan.appliedAt);
  const now = new Date();
  const monthsElapsed = Math.floor((now - appliedDate) / (1000 * 60 * 60 * 24 * 30));
  const totalMonths = loan.years * 12;
  const progressPercent = Math.min((monthsElapsed / totalMonths) * 100, 100);

  return (
    // Mobile View: Card Layout
    <div className="md:hidden bg-white p-4 mb-4 rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{loan.loanName}</h3>
        {getStatusBadge(loan.status)}
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-red-600" />{" "}
          {/* Brand color icon: red-600 */}
          <span className="font-medium text-gray-700">Amount:</span>{" "}
          {formatCurrency(loan.amount)}
        </p>
        <p className="flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-red-600" />{" "}
          {/* Brand color icon: red-600 */}
          <span className="font-medium text-gray-700">
            Monthly Payment:
          </span>{" "}
          {formatCurrency(loan.monthlyPayment)}
        </p>
        <p className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-red-600" />{" "}
          {/* Brand color icon: red-600 */}
          <span className="font-medium text-gray-700">Term:</span> {loan.years}{" "}
          years
        </p>
        <p className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-red-600" />{" "}
          {/* Brand color icon: red-600 */}
          <span className="font-medium text-gray-700">Applied:</span>{" "}
          {formattedDate}
        </p>
        {loan.status.toLowerCase() === 'approved' && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">Payment Progress</span>
              <span className="text-gray-600">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const UserLoanDashboard = () => {
  const [loans, setLoans] = useState([]);
  const { setIsSidebarOpen } = useOutletContext();
  const { currentUser } = useContext(UserContext);
  // Loan summary calculations
  const loanSummary = useMemo(() => {
    const validLoans = loans || [];
    const approvedLoans = validLoans.filter(loan => loan?.status?.toLowerCase() === 'approved');
    const totalLoanAmount = approvedLoans.reduce((sum, loan) => sum + Number(loan.amount || 0), 0);
    const totalMonthlyPayment = approvedLoans.reduce((sum, loan) => sum + Number(loan.monthlyPayment || 0), 0);
    const activeLoans = approvedLoans.length;
    const pendingLoans = validLoans.filter(loan => loan?.status?.toLowerCase() === 'pending').length;

    return { totalLoanAmount, totalMonthlyPayment, activeLoans, pendingLoans };
  }, [loans]);

  // Chart data for loan distribution
  const chartData = useMemo(() => {
    const validLoans = loans || [];
    return validLoans.map(loan => ({
      name: (loan.loanName || '').length > 15 ? loan.loanName.substring(0, 15) + '...' : loan.loanName,
      amount: Number(loan.amount || 0),
      monthly: Number(loan.monthlyPayment || 0),
      status: loan.status
    }));
  }, [loans]);

  useEffect(() => {
    document.title = "My Loans | WindForest Capital";
  }, []);
  useEffect(() => {
    const fetchLoans = async () => {
      const res = await fetch(
        `https://windforest.capital/api/users/${currentUser.id}`
      );
      const data = await res.json();
      setLoans(data.loans || []);
    };
    fetchLoans();
  }, [currentUser]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-1 mb-4 bg-white shadow-lg rounded-md p-4">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl md:text-3xl font-extrabold text-red-700">
            {" "}
            {/* Primary header is now a deep red */}
            Your Loan Applications
          </h1>
        </div>
        <p className="mt-2 text-lg text-gray-600">
          Track the status and details of your active and past loans.
        </p>
      </header>

      {/* Loan Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Loan Amount</p>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(loanSummary.totalLoanAmount)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Monthly Payments</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(loanSummary.totalMonthlyPayment)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Loans</p>
              <p className="text-xl font-bold text-green-600">
                {loanSummary.activeLoans}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-xl font-bold text-yellow-600">
                {loanSummary.pendingLoans}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Distribution Chart */}
      {loans.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Loan Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#ef4444" name="Loan Amount" />
              <Bar dataKey="monthly" fill="#3b82f6" name="Monthly Payment" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-50">
            {" "}
            {/* Table header background is light red */}
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider"
              >
                {" "}
                {/* Table header text is deep red */}
                Loan Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider"
              >
                Monthly Payment
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider"
              >
                Term
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider"
              >
                Applied On
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider"
              >
                Progress
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((loan) => {
              // Calculate payment progress for each loan
              const appliedDate = new Date(loan.appliedAt);
              const now = new Date();
              const monthsElapsed = Math.floor((now - appliedDate) / (1000 * 60 * 60 * 24 * 30));
              const totalMonths = loan.years * 12;
              const progressPercent = Math.min((monthsElapsed / totalMonths) * 100, 100);

              return (
                <tr
                  key={loan.loanId}
                  className="hover:bg-red-50/50 transition duration-150 ease-in-out"
                >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {loan.loanName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatCurrency(loan.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatCurrency(loan.monthlyPayment)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {loan.years} years
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(loan.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {loan.status.toLowerCase() === 'approved' ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{Math.round(progressPercent)}%</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(loan.status)}
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View: List of Cards */}
      <div className="md:hidden">
        {loans.map((loan) => (
          <LoanItem key={loan.loanId} loan={loan} />
        ))}
      </div>

      {loans.length === 0 && (
        <div className="p-10 text-center text-gray-500 bg-white rounded-md shadow-sm mt-6">
          <p className="text-lg">You have no loan applications on file.</p>
        </div>
      )}
    </div>
  );
};

export default UserLoanDashboard;
