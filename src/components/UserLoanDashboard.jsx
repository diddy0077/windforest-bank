import React, { useState } from 'react';
import { Clock, DollarSign, Calendar, TrendingUp } from 'lucide-react'; // Using lucide-react for icons
import { useOutletContext } from 'react-router-dom';
import { useContext,useEffect } from 'react';
import { UserContext } from './UserContext';



// Helper function to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Helper function to get status badge styling
const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
        case 'approved':
            return (
                // Standard Green for Approved
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                    Approved
                </span>
            );
        case 'pending':
            return (
                // Standard Yellow for Pending
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                    Pending Review
                </span>
            );
        case 'paid':
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

    return (
        // Mobile View: Card Layout
        <div className="md:hidden bg-white p-4 mb-4 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{loan.loanName}</h3>
                {getStatusBadge(loan.status)}
            </div>
            <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-red-600" /> {/* Brand color icon: red-600 */}
                    <span className="font-medium text-gray-700">Amount:</span> {formatCurrency(loan.amount)}
                </p>
                <p className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-red-600" /> {/* Brand color icon: red-600 */}
                    <span className="font-medium text-gray-700">Monthly Payment:</span> {formatCurrency(loan.monthlyPayment)}
                </p>
                <p className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-red-600" /> {/* Brand color icon: red-600 */}
                    <span className="font-medium text-gray-700">Term:</span> {loan.years} years
                </p>
                <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-red-600" /> {/* Brand color icon: red-600 */}
                    <span className="font-medium text-gray-700">Applied:</span> {formattedDate}
                </p>
            </div>
        </div>
    );
};

const UserLoanDashboard = () => {
    const [loans, setLoans] = useState([]);
  const { setIsSidebarOpen, } = useOutletContext();
  const { currentUser } = useContext(UserContext)
  console.log(loans)
  useEffect(() => {
    const fetchLoans = async () => {
      const res = await fetch(`http://localhost:5000/users/${currentUser.id}`)
      const data = await res.json()
      setLoans(data.loans)
    }
    fetchLoans()
  },[currentUser])


    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
        <header className="mb-8">
          <div className='flex items-center gap-1 mb-4 bg-white shadow-lg rounded-md p-4'>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden"
            >
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
              <h1 className="text-2xl md:text-3xl font-extrabold text-red-700"> {/* Primary header is now a deep red */}
                    Your Loan Applications
                </h1>
               </div>
                <p className="mt-2 text-lg text-gray-600">
                    Track the status and details of your active and past loans.
                </p>
            </header>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-red-50"> {/* Table header background is light red */}
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider"> {/* Table header text is deep red */}
                                Loan Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                                Monthly Payment
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                                Term
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                                Applied On
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loans.map((loan) => (
                            <tr key={loan.loanId} className="hover:bg-red-50/50 transition duration-150 ease-in-out">
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
                                    {getStatusBadge(loan.status)}
                                </td>
                            </tr>
                        ))}
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
                <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-lg mt-6">
                    <p className="text-lg">You have no loan applications on file.</p>
                </div>
            )}
        </div>
    );
};

export default UserLoanDashboard;
