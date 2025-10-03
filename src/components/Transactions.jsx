import React, { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useOutletContext } from "react-router-dom";

const Transactions = () => {
  
  const { currentUser } = useContext(UserContext);
  const { setIsSidebarOpen,transactions,setTransactions } = useOutletContext();
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }
console.log(transactions)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:5000/transactions");
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
    <div className="bg-white shadow-lg rounded-2xl p-4 my-6 container mx-auto md:w-[90%] mb-20 min-h-screen w-[95%] ">
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
          Recent Transaction History
        </h2>
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
            {transactions.length > 0 ? (
              transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((tx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.isDebit
                        ? `Transfer to ${tx.toUserName}`
                        : `Received from ${tx.fromUserName}`}
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
                    {<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">
                      ${tx.balanceAfter.toLocaleString()}
                    </td>}
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden flex flex-col gap-4">
        {transactions.length > 0 ? (
          transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((tx, idx) => (
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
                <div className="text-gray-700 font-medium">
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
          <p className="text-center text-gray-500">No transactions yet</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
