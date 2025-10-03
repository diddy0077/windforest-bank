import React, { useEffect, useContext, useState, useMemo } from "react";
import { UserContext } from "./UserContext";
import { useOutletContext } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Transactions = () => {
  const { currentUser } = useContext(UserContext);
  const { setIsSidebarOpen, transactions, setTransactions } =
    useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, debit, credit
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Currency formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Balance After'];
    const csvData = filteredTransactions.map(tx => [
      formatDate(tx.date),
      tx.isDebit ? `Transfer to ${tx.toUserName}` : `Received from ${tx.fromUserName}`,
      tx.isDebit ? `-${tx.amount}` : `+${tx.amount}`,
      tx.balanceAfter
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }
  // Filtered and searched transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesSearch =
          tx.fromUserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.toUserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
          filterType === "all" ||
          (filterType === "debit" && tx.isDebit) ||
          (filterType === "credit" && !tx.isDebit);
        const txDateStr = tx.date.split('T')[0]; // Get YYYY-MM-DD part
        const matchesStartDate = !startDate || txDateStr >= startDate;
        const matchesEndDate = !endDate || txDateStr <= endDate;
        return matchesSearch && matchesFilter && matchesStartDate && matchesEndDate;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, searchTerm, filterType, startDate, endDate]);

  // Summary calculations
  const summary = useMemo(() => {
    const totalDebits = transactions
      .filter((tx) => tx.isDebit)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    const totalCredits = transactions
      .filter((tx) => !tx.isDebit)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    const netChange = totalCredits - totalDebits;
    return { totalDebits, totalCredits, netChange };
  }, [transactions]);

  // Chart data for last 7 days
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(tx =>
        new Date(tx.date).toISOString().split('T')[0] === date
      );
      const debits = dayTransactions
        .filter(tx => tx.isDebit)
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
      const credits = dayTransactions
        .filter(tx => !tx.isDebit)
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Debits: debits,
        Credits: credits,
      };
    });
  }, [transactions]);

  console.log(transactions);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          "https://windforest-json-server.onrender.com/transactions"
        );
        if (!res.ok) {
          throw {
            message: "Error fetching transactions",
          };
        }
        const data = await res.json();
        const userTransactions = data
          .filter(
            (tx) =>
              tx.fromUserId === currentUser.id || tx.toUserId === currentUser.id
          )
          .map((tx) => {
            const isDebit = tx.fromUserId === currentUser.id;
            return {
              ...tx,
              isDebit,
              displayAmount: isDebit ? -tx.amount : tx.amount,
              balanceAfter: isDebit
                ? tx.balanceAfterSender
                : tx.balanceAfterReceiver,
            };
          });
        setTransactions(userTransactions);
      } catch (error) {
        console.log("Error fetching transactions", error);
      }
    };
    fetchTransactions();
  }, [currentUser.id]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 my-6 container mx-auto md:w-[90%] min-h-screen w-[95%]">
      <div className="flex items-center gap-3 mb-8">
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
        <h2 className="text-xl font-semibold text-gray-800">
          Transaction History
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Debits</p>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(-summary.totalDebits)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Credits</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(summary.totalCredits)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Net Change</p>
              <p className={`text-xl font-bold ${summary.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.netChange >= 0 ? '+' : ''}{formatCurrency(Math.abs(summary.netChange))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Activity (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="Debits" fill="#ef4444" />
            <Bar dataKey="Credits" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="relative">
          <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none"
          >
            <option value="all">All Transactions</option>
            <option value="debit">Debits Only</option>
            <option value="credit">Credits Only</option>
          </select>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Start Date"
            />
          </div>
          <div className="relative">
            <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="End Date"
            />
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance After
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        {tx.isDebit ? (
                          <ArrowUpRight className="w-4 h-4 text-red-500 mr-2" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-green-500 mr-2" />
                        )}
                        {tx.isDebit
                          ? `Transfer to ${tx.toUserName}`
                          : `Received from ${tx.fromUserName}`}
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                        tx.isDebit ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {tx.isDebit
                        ? `-$${Number(tx.amount).toLocaleString()}`
                        : `+$${Number(tx.amount).toLocaleString()}`}
                    </td>
                    {
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">
                        ${tx.balanceAfter.toLocaleString()}
                      </td>
                    }
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  {transactions.length === 0 ? "No transactions yet." : "No transactions match your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-4 shadow flex flex-col"
              >
                <div className="flex justify-between mb-1 text-sm text-gray-500">
                  <span>{formatDate(tx.date)}</span>
                  <span
                    className={
                      tx.isDebit
                        ? "text-red-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {tx.isDebit ? `-$${tx.amount}` : `+$${tx.amount}`}
                  </span>
                </div>
                <div className="text-gray-700 font-medium flex items-center">
                  {tx.isDebit ? (
                    <ArrowUpRight className="w-4 h-4 text-red-500 mr-2" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-green-500 mr-2" />
                  )}
                  {tx.isDebit
                    ? `Transfer to ${tx.toUserName}`
                    : `Received from ${tx.fromUserName}`}
                </div>
                <div className="text-gray-800 font-semibold text-right mt-1">
                  Balance After: ${tx.balanceAfter.toLocaleString()}
                </div>
              </div>
            ))
        ) : (
          <p className="text-center text-gray-500">
            {transactions.length === 0 ? "No transactions yet" : "No transactions match your filters."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
