import React, { useState } from "react";
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

const AccountDashboard = () => {
  const { setIsSidebarOpen, notifications, setNotifications, transactions } =
    useOutletContext();
  const { currentUser } = useContext(UserContext);

  const [openNotifications, setOpenNotifications] = useState(false);
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
              <button className="flex-1 min-w-40 bg-gray-800 text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:bg-gray-900 transition-all duration-300 cursor-pointer transform hover:scale-105">
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
    </div>
  );
};

export default AccountDashboard;
