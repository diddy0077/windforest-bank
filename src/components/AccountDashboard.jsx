import React, { useState, useMemo } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import NotificationsModal from "./NotificationsModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Plus,
  History,
  Zap,
  Phone,
  Wifi,
  Shield,
  Car,
  Home,
  Receipt,
  Search,
  Star,
  StarOff,
  Clock,
  Bell,
  Upload,
  FileText,
  TrendingUp,
  CheckCircle,
  X,
} from "lucide-react";

const AccountDashboard = () => {
  const { setIsSidebarOpen, notifications, setNotifications, transactions } =
    useOutletContext();
  const { currentUser } = useContext(UserContext);

  const [openNotifications, setOpenNotifications] = useState(false);
  const [showBillPayment, setShowBillPayment] = useState(false);
  const [billers, setBillers] = useState([]);
  const [billPayments, setBillPayments] = useState([]);
  const [billerSearchTerm, setBillerSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showRecurringSetup, setShowRecurringSetup] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);
  const [uploadedBill, setUploadedBill] = useState(null);
  const [scheduledPayments, setScheduledPayments] = useState([]);
  const [showAddBiller, setShowAddBiller] = useState(false);
  const [newBiller, setNewBiller] = useState({ name: '', category: 'utilities', accountNumber: '' });
  const [paymentForm, setPaymentForm] = useState({ billerId: '', amount: '', account: 'checking' });
  const [recurringForm, setRecurringForm] = useState({
    billerId: '',
    amount: '',
    frequency: 'monthly',
    startDate: '',
    endDate: ''
  });
  // Bill payment statistics
  const billStats = useMemo(() => {
    const totalPaid = billPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const thisMonth = billPayments.filter(payment => {
      const paymentDate = new Date(payment.date);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    }).reduce((sum, payment) => sum + Number(payment.amount), 0);

    return { totalPaid, thisMonth, totalPayments: billPayments.length };
  }, [billPayments]);

  // Filtered billers for search and category
  const filteredBillers = useMemo(() => {
    return billers.filter(biller => {
      const matchesSearch = biller.name.toLowerCase().includes(billerSearchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || biller.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [billers, billerSearchTerm, selectedCategory]);

  // Bill category analytics
  const categoryAnalytics = useMemo(() => {
    const categories = {};
    billPayments.forEach(payment => {
      const category = payment.category || 'Other';
      if (!categories[category]) {
        categories[category] = { total: 0, count: 0 };
      }
      categories[category].total += Number(payment.amount);
      categories[category].count += 1;
    });
    return Object.entries(categories).map(([name, data]) => ({
      name,
      total: data.total,
      count: data.count,
      average: data.total / data.count
    }));
  }, [billPayments]);

  console.log(currentUser);
  const spendingData = [
    { category: "Groceries", amount: 350 },
    { category: "Shopping", amount: 150 },
    { category: "Bills", amount: 250 },
    { category: "Food & Drink", amount: 120 },
    { category: "Transport", amount: 80 },
  ];

  useEffect(() => {
    const threshold = 100;
    if (currentUser.accountBalance < threshold) {
      // Prevent duplicate low-balance notifications
      const exists = notifications.some(
        (n) => n.type === "warning" && n.message.includes("low balance")
      );
      if (!exists) {
        const lowBalanceNotification = {
          id: crypto.randomUUID(),
          type: "warning",
          message: `Your account balance is below $${threshold}!`,
          date: new Date().toISOString(),
          read: false,
        };
        setNotifications((prev) => [...prev, lowBalanceNotification]);

        fetch(
          `https://windforest-json-server.onrender.com/users/${currentUser.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              notifications: [
                ...currentUser.notifications,
                lowBalanceNotification,
              ],
            }),
          }
        );
      }
    }
  }, [currentUser]);

  function mask(num) {
    const str = num.toString();
    const last4 = str.slice(-4); // last 4 digits
    const masked = "*".repeat(str.length - 4); // mask the rest
    return masked + last4;
  }

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `https://windforest-json-server.onrender.com/users/${currentUser.id}`
        );
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [currentUser, setNotifications]);
  console.log(currentUser);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const statement = {
    accountHolder: {
      fullName: currentUser.fullName,
      address: currentUser.address,
      email: currentUser.email,
      phone: currentUser.phone,
      accountNumber: currentUser.accountNumber,
      accountType: currentUser.accountType,
    },
    summary: {
      currentBalance: currentUser.accountBalance,
      initialDeposit: currentUser.initialDeposit,
      income: currentUser.income,
      employer: currentUser.employerName,
    },
    transactions: transactions || [],
    loans: currentUser.loans || [],
  };

  const downloadStatement = () => {
    const doc = new jsPDF();

    // ---- Bank Header ----
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38); // Tailwind red-600
    doc.text("WindForst Bank", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Official Account Statement", 105, 28, { align: "center" });
    doc.line(14, 32, 196, 32); // separator line

    // ---- Account Holder Info ----
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text("Account Holder Details", 14, 42);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${statement.accountHolder.fullName}`, 14, 50);
    doc.text(
      `Account Number: ${statement.accountHolder.accountNumber}`,
      14,
      56
    );
    doc.text(`Account Type: ${statement.accountHolder.accountType}`, 14, 62);
    doc.text(`Email: ${statement.accountHolder.email}`, 14, 68);
    doc.text(`Phone: ${statement.accountHolder.phone}`, 14, 74);
    doc.text(`Address: ${statement.accountHolder.address}`, 14, 80);

    // ---- Account Summary ----
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text("Account Summary", 14, 95);

    autoTable(doc, {
      startY: 100,
      headStyles: { fillColor: [220, 38, 38], halign: "center" },
      bodyStyles: { halign: "center" },
      head: [["Current Balance", "Initial Deposit", "Income", "Employer"]],
      body: [
        [
          `$${statement.summary.currentBalance.toLocaleString()}`,
          `$${statement.summary.initialDeposit.toLocaleString()}`,
          `$${statement.summary.income.toLocaleString()}`,
          statement.summary.employer,
        ],
      ],
    });

    // ---- Transactions ----
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text("Transactions", 14, doc.lastAutoTable.finalY + 15);

    const transactionRows = (statement.transactions || [])
      .slice(0, 10)
      .map((tx) => [
        new Date(tx.date).toLocaleDateString(),
        tx.isDebit
          ? `Transfer to ${tx.toUserName}`
          : `Received from ${tx.fromUserName}`,
        tx.isDebit ? `$${tx.amount}` : "-",
        !tx.isDebit ? `$${tx.amount}` : "-",
        `$${tx.balanceAfter.toLocaleString()}`,
      ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      headStyles: { fillColor: [220, 38, 38], halign: "center" },
      bodyStyles: { halign: "center" },
      head: [["Date", "Description", "Debit", "Credit", "Balance"]],
      body: transactionRows.length
        ? transactionRows
        : [["-", "-", "-", "-", "-"]],
    });

    // ---- Loans ----
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text("Loans", 14, doc.lastAutoTable.finalY + 15);

    const loanRows = (statement.loans || []).map((loan) => [
      loan.loanId,
      loan.loanName,
      `$${loan.amount.toLocaleString()}`,
      `${loan.years} years`,
      `$${loan.monthlyPayment.toFixed(2)}`,
      loan.status,
      new Date(loan.appliedAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      headStyles: { fillColor: [220, 38, 38], halign: "center" },
      bodyStyles: { halign: "center" },
      head: [
        [
          "Loan ID",
          "Loan Name",
          "Amount",
          "Years",
          "Monthly Payment",
          "Status",
          "Applied At",
        ],
      ],
      body: loanRows.length ? loanRows : [["-", "-", "-", "-", "-", "-", "-"]],
    });

    // ---- Footer ----
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "This is a system-generated statement. For assistance, contact support@windforstbank.com",
      105,
      pageHeight - 10,
      { align: "center" }
    );

    // ---- Save ----
    doc.save("WindForst_Bank_Statement.pdf");
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 transition-all duration-300">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md rounded-2xl mb-8">
          <div className="flex items-center space-x-4">
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Welcome, {currentUser.fullName}
            </h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setOpenNotifications(true)}
              className="flex items-center space-x-2 p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer"
            >
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {unreadCount}
                </span>
              )}
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Account & Quick Actions */}
          <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-6 sm:p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-500">
                  Total Balance
                </h2>
                <p className="text-3xl sm:text-5xl font-extrabold text-red-700 mt-2">
                  ${Number(currentUser?.accountBalance || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Last Login: {new Date(currentUser.lastLogin).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-gray-600 text-sm">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="font-semibold text-gray-900">
                  {currentUser.accountType}:
                </p>
                <p className="text-gray-700">
                  Balance:{" "}
                  <span className="font-bold text-lg">
                    ${currentUser?.accountBalance?.toLocaleString()}
                  </span>{" "}
                </p>
                <p className="text-gray-700">
                  Account Number:{" "}
                  {currentUser?.accountNumber
                    ? mask(currentUser.accountNumber)
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link
                to="/account-dashboard/transfer"
                className="flex-1 min-w-40 bg-red-600 text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
              >
                Transfer Funds
              </Link>
              <button
                onClick={() => setShowBillPayment(true)}
                className="flex-1 min-w-40 bg-gray-800 text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:bg-gray-900 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                Pay Bills
              </button>
              <button
                onClick={downloadStatement}
                className="flex-1 min-w-40 bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-full shadow-lg hover:bg-gray-400 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                Download Statement
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Notifications
            </h2>
            <ul className="space-y-3">
              {notifications
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 2)
                .map((n) => (
                  <li
                    key={n.id}
                    className={`cursor-pointer p-4 rounded-lg shadow flex justify-between items-start transition-colors ${
                      n.read ? "bg-gray-50" : "bg-red-50"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm mb-1 ${
                          n.type === "success"
                            ? "text-green-600"
                            : n.type === "error"
                            ? "text-red-600"
                            : "text-blue-600"
                        } font-semibold`}
                      >
                        {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
                      </p>
                      <p
                        className={`text-gray-700 text-sm ${
                          !n.read ? "font-medium" : ""
                        }`}
                      >
                        {n.message.slice(0, 50) + "..."}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {new Date(n.date).toLocaleString()}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 w-[90%] mx-auto">
        {currentUser?.card?.map((card) => (
          <div
            key={card.id}
            className="relative p-6 rounded-2xl shadow-lg text-white transform transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(45deg, #1f2937, #4b5563)",
              minHeight: "200px",
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-medium">Debit Card</p>
                <p className="text-sm font-light opacity-80">{"Active"}</p>
              </div>
              <span className="text-xl font-bold tracking-widest">
                WindForest
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-6 px-6">
              <p className="text-xl font-mono tracking-widest">
                {mask(card.cardNumber)}
              </p>
              <div className="flex justify-between items-end mt-4">
                <p className="text-sm uppercase font-semibold">
                  {currentUser.fullName}
                </p>
                <div>
                  <p>{card.cardType}</p>
                  <p className="text-sm font-medium">EXP: {card.expiryDate}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white shadow-md rounded-xl p-6 mb-6 w-[90%] mx-auto my-10">
        <h2 className="text-xl font-semibold mb-4">Spending Breakdown</h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={spendingData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#ef4444" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <NotificationsModal
        isOpen={openNotifications}
        onClose={() => setOpenNotifications(false)}
        notifications={notifications}
        setNotifications={setNotifications}
      />

      {/* Bill Payment Modal */}
      {showBillPayment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Pay Bills</h2>
                <button
                  onClick={() => setShowBillPayment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Tab Navigation */}
              <div className="flex border-b mb-6">
                {[
                  { id: 'pay', label: 'Pay Bills', icon: DollarSign },
                  { id: 'billers', label: 'My Billers', icon: Receipt },
                  { id: 'recurring', label: 'Recurring', icon: Clock },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm ${
                      selectedCategory === tab.id
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setSelectedCategory(tab.id)}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Pay Bills Tab */}
              {selectedCategory === 'pay' && (
                <div>
                  {/* Bill Payment Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <Receipt className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Total Paid</p>
                          <p className="text-xl font-bold text-blue-600">
                            ${billStats.totalPaid.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <Calendar className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">This Month</p>
                          <p className="text-xl font-bold text-green-600">
                            ${billStats.thisMonth.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center">
                        <History className="w-8 h-8 text-purple-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Payments Made</p>
                          <p className="text-xl font-bold text-purple-600">
                            {billStats.totalPayments}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Pay */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Quick Pay</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: "Electricity", icon: Zap, color: "text-yellow-600", category: "utilities" },
                        { name: "Internet", icon: Wifi, color: "text-blue-600", category: "communications" },
                        { name: "Phone", icon: Phone, color: "text-green-600", category: "communications" },
                        { name: "Insurance", icon: Shield, color: "text-red-600", category: "insurance" },
                        { name: "Water", icon: Home, color: "text-cyan-600", category: "utilities" },
                        { name: "Gas", icon: Zap, color: "text-orange-600", category: "utilities" },
                        { name: "Cable TV", icon: Wifi, color: "text-purple-600", category: "entertainment" },
                        { name: "Car Payment", icon: Car, color: "text-gray-600", category: "transportation" },
                      ].map((billType) => (
                        <button
                          key={billType.name}
                          className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setPaymentForm({
                              billerId: billType.name,
                              amount: '',
                              account: 'checking'
                            });
                            setShowPaymentConfirmation(true);
                          }}
                        >
                          <billType.icon className={`w-8 h-8 mb-2 ${billType.color}`} />
                          <span className="text-sm font-medium text-gray-700">{billType.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bill Upload/Scan */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Upload Bill</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload your bill for automatic amount detection</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setUploadedBill(e.target.files[0])}
                        className="hidden"
                        id="bill-upload"
                      />
                      <label
                        htmlFor="bill-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </label>
                      {uploadedBill && (
                        <p className="text-sm text-green-600 mt-2">File uploaded: {uploadedBill.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Scheduling */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Schedule Payment</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                          <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>
                      <button className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                        Schedule Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* My Billers Tab */}
              {selectedCategory === 'billers' && (
                <div>
                  {/* Search and Filter */}
                  <div className="mb-6">
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1 relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search billers..."
                          value={billerSearchTerm}
                          onChange={(e) => setBillerSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="all">All Categories</option>
                        <option value="utilities">Utilities</option>
                        <option value="communications">Communications</option>
                        <option value="insurance">Insurance</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="transportation">Transportation</option>
                      </select>
                    </div>
                  </div>

                  {/* Billers List */}
                  <div className="space-y-3">
                    {filteredBillers.map((biller) => (
                      <div key={biller.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">{biller.name}</p>
                            <p className="text-sm text-gray-500">{biller.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setBillers(billers.map(b =>
                                b.id === biller.id ? {...b, favorite: !b.favorite} : b
                              ));
                            }}
                            className={`p-2 rounded-full ${biller.favorite ? 'text-yellow-500' : 'text-gray-400'}`}
                          >
                            {biller.favorite ? <Star className="w-5 h-5" /> : <StarOff className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => {
                              setPaymentForm({
                                billerId: biller.id,
                                amount: '',
                                account: 'checking'
                              });
                              setShowPaymentConfirmation(true);
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Biller */}
                  <div className="border-t pt-6 mt-6">
                    <button
                      onClick={() => setShowAddBiller(true)}
                      className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Biller
                    </button>
                  </div>
                </div>
              )}

              {/* Recurring Payments Tab */}
              {selectedCategory === 'recurring' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recurring Payments</h3>
                  <div className="space-y-4">
                    {scheduledPayments.map((payment) => (
                      <div key={payment.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{payment.billerName}</p>
                            <p className="text-sm text-gray-600">
                              ${payment.amount} - {payment.frequency} - Next: {new Date(payment.nextDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Bell className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowRecurringSetup(true)}
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Set Up Recurring Payment
                  </button>
                </div>
              )}

              {/* Analytics Tab */}
              {selectedCategory === 'analytics' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Bill Payment Analytics</h3>
                  <div className="space-y-6">
                    {categoryAnalytics.map((category) => (
                      <div key={category.name} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{category.name}</h4>
                          <span className="text-sm text-gray-600">
                            {category.count} payments
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total: ${category.total.toLocaleString()}</span>
                          <span>Average: ${category.average.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${(category.total / billStats.totalPaid) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentConfirmation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Confirm Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Biller</label>
                  <input
                    type="text"
                    value={typeof paymentForm.billerId === 'string' && paymentForm.billerId.includes('-') ?
                      billers.find(b => b.id === paymentForm.billerId)?.name || paymentForm.billerId :
                      paymentForm.billerId}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    placeholder="Enter amount"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
                  <select
                    value={paymentForm.account}
                    onChange={(e) => setPaymentForm({...paymentForm, account: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPaymentConfirmation(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Process payment
                    const billerName = typeof paymentForm.billerId === 'string' && paymentForm.billerId.includes('-') ?
                      billers.find(b => b.id === paymentForm.billerId)?.name || paymentForm.billerId :
                      paymentForm.billerId;

                    const newPayment = {
                      id: crypto.randomUUID(),
                      billerName: billerName,
                      amount: paymentForm.amount,
                      date: new Date().toISOString(),
                      account: paymentForm.account,
                      status: 'completed'
                    };
                    setBillPayments([...billPayments, newPayment]);
                    setShowPaymentConfirmation(false);
                    setPaymentForm({ billerId: '', amount: '', account: 'checking' });
                    alert('Payment processed successfully!');
                  }}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Biller Modal */}
      {showAddBiller && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Add New Biller</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Biller Name</label>
                  <input
                    type="text"
                    value={newBiller.name}
                    onChange={(e) => setNewBiller({...newBiller, name: e.target.value})}
                    placeholder="Enter biller name"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newBiller.category}
                    onChange={(e) => setNewBiller({...newBiller, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="utilities">Utilities</option>
                    <option value="communications">Communications</option>
                    <option value="insurance">Insurance</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="transportation">Transportation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    value={newBiller.accountNumber}
                    onChange={(e) => setNewBiller({...newBiller, accountNumber: e.target.value})}
                    placeholder="Enter account number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddBiller(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Add new biller
                    const biller = {
                      id: crypto.randomUUID(),
                      ...newBiller,
                      favorite: false
                    };
                    setBillers([...billers, biller]);
                    setShowAddBiller(false);
                    setNewBiller({ name: '', category: 'utilities', accountNumber: '' });
                    alert('Biller added successfully!');
                  }}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Add Biller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Payment Setup Modal */}
      {showRecurringSetup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Set Up Recurring Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Biller</label>
                  <select
                    value={recurringForm.billerId}
                    onChange={(e) => setRecurringForm({...recurringForm, billerId: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Choose a biller</option>
                    {billers.map(biller => (
                      <option key={biller.id} value={biller.id}>{biller.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={recurringForm.amount}
                    onChange={(e) => setRecurringForm({...recurringForm, amount: e.target.value})}
                    placeholder="Enter amount"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    value={recurringForm.frequency}
                    onChange={(e) => setRecurringForm({...recurringForm, frequency: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={recurringForm.startDate}
                    onChange={(e) => setRecurringForm({...recurringForm, startDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    value={recurringForm.endDate}
                    onChange={(e) => setRecurringForm({...recurringForm, endDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRecurringSetup(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Set up recurring payment
                    const selectedBiller = billers.find(b => b.id === recurringForm.billerId);
                    const recurringPayment = {
                      id: crypto.randomUUID(),
                      billerName: selectedBiller?.name || 'Unknown',
                      amount: recurringForm.amount,
                      frequency: recurringForm.frequency,
                      startDate: recurringForm.startDate,
                      endDate: recurringForm.endDate,
                      nextDate: recurringForm.startDate,
                      status: 'active'
                    };
                    setScheduledPayments([...scheduledPayments, recurringPayment]);
                    setShowRecurringSetup(false);
                    setRecurringForm({
                      billerId: '',
                      amount: '',
                      frequency: 'monthly',
                      startDate: '',
                      endDate: ''
                    });
                    alert('Recurring payment set up successfully!');
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Set Up Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDashboard;
