import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const TransferIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
    />
  </svg>
);

const TransferIcon2 = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
    />
  </svg>
);

const CheckIcon = ({ className = "w-12 h-12" }) => (
  // Replaced green with red accent colors for consistency
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TransferFromExternalAccounts = ({
  externalTransfer,
  setExternalTransfer,
}) => {
  const [transferAmount, setTransferAmount] = useState("");
  const [selectedFrom, setSelectedFrom] = useState("external-1234");
  const [selectedTo, setSelectedTo] = useState("checking-5678");
  const [isTransferring, setIsTransferring] = useState(false);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [external, setExternal] = useState(null);
  const [step, setStep] = useState(1);
  const nav = useNavigate();

  const SummaryRow = ({ label, value, isAmount = false }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span
        className={`text-sm font-semibold ${
          isAmount ? "text-red-600 text-lg" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );

  const SummaryRow2 = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );

  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleAmountChange = (e) => {
    // Basic validation to only allow numbers and one decimal point
    let value = e.target.value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");

    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }
    setTransferAmount(value);
  };

  const openTransferSummary = async (e) => {
    e.preventDefault();
    setIsTransferring(true);
    if (parseFloat(transferAmount) <= 0 || !transferAmount) {
      toast.error("Please enter a valid amount.");
      return;
    }
    const res = await fetch(
      "https://windforest-json-server.onrender.com/users"
    );
    const users = await res.json();
    const accountToTransferFrom = users.find(
      (user) => Number(user.accountNumber) === Number(selectedFrom)
    );
    console.log(accountToTransferFrom);
    setExternal(accountToTransferFrom);
    setTimeout(() => {
      setIsTransferring(false);
      setStep(2);
    }, 3000);
  };

  const generateReference = () => {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    return random;
  };

  const handleSubmit = async () => {
    setIsTransferring(true);
    try {
      const senderNotification = {
        id: crypto.randomUUID(),
        type: "success",
        message: `You successfully made an external transfer of $${transferAmount} to ${currentUser.fullName}`,
        date: new Date().toISOString(),
        read: false,
      };
      const receiverNotification = {
        id: crypto.randomUUID(),
        type: "success",
        message: `Your incoming external transfer of $${transferAmount} from ${
          external.fullName
        }(****${external.accountNumber.slice(-4)}) is successful.`,
        date: new Date().toISOString(),
        read: false,
      };
      const updatedCurrentUser = {
        ...currentUser,
        accountBalance: currentUser.accountBalance + Number(transferAmount),
        notifications: [...currentUser.notifications, receiverNotification],
      };
      const updatedAccountToTransferFrom = {
        ...external,
        accountBalance: external.accountBalance - Number(transferAmount),
        notifications: [...external.notifications, senderNotification],
      };
      const transaction = {
        fromUserId: external.id,
        fromUserName: external.fullName,
        toUserId: currentUser.id,
        toUserName: currentUser.fullName,
        amount: transferAmount,
        date: new Date().toISOString(),
        balanceAfterSender: external.accountBalance - Number(transferAmount),
        balanceAfterReceiver:
        currentUser.accountBalance + Number(transferAmount),
      };
      const response = await fetch(
        "https://windforest-json-server.onrender.com/transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      );
      if (!response.ok) {
        throw { message: "Error posting transaction" };
      }
      const res = await fetch(
        `https://windforest-json-server.onrender.com/users/${currentUser.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCurrentUser),
        }
      );
      if (!res.ok) {
        throw { message: "Error updating current user" };
      }
      const data = await res.json();
      setCurrentUser(data);
      const res2 = await fetch(
        `https://windforest-json-server.onrender.com/users/${external.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAccountToTransferFrom),
        }
      );
      if (!res2.ok) {
        throw { message: "Error updating external account holder" };
      }
      const data2 = await res2.json();
      console.log(data2);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success(
        `External transfer of $${Number(transferAmount).toLocaleString(
          undefined,
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )} successfully initiated!`
      );
      setStep(3);
    } catch (error) {
      console.log("Error initiating transfer!", error);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 transition duration-300 ${
        externalTransfer
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {step === 1 && (
        <div className="w-full mx-3 max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header Section - Red Accent */}
          <div className="flex items-center p-6 bg-red-600 text-white rounded-t-xl relative">
            <TransferIcon className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold tracking-tight">Fund Transfer</h2>
            <button
              onClick={() => setExternalTransfer(false)}
              className="absolute top-6 right-4 cursor-pointer"
            >
              <svg
                className="fill-white"
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={openTransferSummary} className="p-8 space-y-6">
            {/* FROM Account Select */}
            <div>
              <label
                htmlFor="fromAccount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Transfer From (External Account)
              </label>
              <select
                id="fromAccount"
                value={selectedFrom}
                onChange={(e) => setSelectedFrom(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-800 transition duration-150 shadow-sm bg-white"
                disabled={isTransferring}
              >
                <option value="">Select an account</option>
                {currentUser.linkedAccounts.map((acc) => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.linkedUserName} (****{acc.accountNumber.slice(-4)})
                  </option>
                ))}
              </select>
            </div>

            {/* TO Account Select */}
            <div>
              <label
                htmlFor="toAccount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Transfer To (WindForest Account)
              </label>
              <select
                id="toAccount"
                value={selectedTo}
                onChange={(e) => setSelectedTo(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-800 transition duration-150 shadow-sm bg-white"
                disabled={isTransferring}
              >
                <option value="">Select an account</option>
                <option key={currentUser.id} value={currentUser.accountNumber}>
                  {currentUser.accountType} (****
                  {currentUser.accountNumber.slice(-4)})
                </option>
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-xl">
                  $
                </span>
                <input
                  type="text"
                  id="amount"
                  value={transferAmount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full p-3 pl-8 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-800 transition duration-150 shadow-sm font-mono text-xl"
                  disabled={isTransferring}
                />
              </div>
            </div>

            {/* Instructions/Disclaimer */}
            <p className="text-xs text-gray-500 pt-2">
              Transfers from external accounts may take 1-3 business days to
              settle.
            </p>

            {/* Transfer Button - Red-600 Primary Action */}
            <button
              type="submit"
              disabled={
                isTransferring ||
                parseFloat(transferAmount) <= 0 ||
                !transferAmount
              }
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {isTransferring ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isTransferring ? "Initiating Transfer..." : "Complete Transfer"}
            </button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div className="w-full mx-3 max-w-sm bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header Section - Red Accent */}
          <div className="flex items-center p-4 bg-red-600 text-white relative">
            <TransferIcon className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold tracking-tight">
              Transfer Summary
            </h2>
            <button
              onClick={() => setExternalTransfer(false)}
              className="absolute top-4 right-4 cursor-pointer"
            >
              <svg
                className="fill-white"
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </button>
          </div>

          {/* Main Summary Content */}
          <div className="p-5 space-y-4">
            {/* Amount Block - Highlighted */}
            <div className="text-center p-4 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-gray-500 text-sm font-medium">
                Transfer Amount
              </p>
              <p className="text-4xl font-extrabold text-red-600 mt-1">
                $
                {Number(transferAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* Detailed Rows */}
            <div className="border border-gray-200 rounded-lg p-3">
              <h3 className="text-md font-bold text-gray-800 mb-2 border-b pb-2">
                Details
              </h3>

              <SummaryRow
                label="From Account"
                value={`${
                  external.fullName
                } (****${external.accountNumber.slice(-4)})`}
              />
              <SummaryRow
                label="To Account"
                value={`${
                  currentUser.accountType
                } (****${currentUser.accountNumber.slice(-4)})`}
              />
              <SummaryRow label="Estimated Delivery" value={"5-10 mins"} />
              <SummaryRow label="Transaction Date" value={date} />
              <SummaryRow label="Fee" value={`$0.00`} />
            </div>

            {/* Final Confirmation/Action Area */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-red-600 hover:bg-red-700 transition duration-150 cursor-pointer flex items-center justify-center"
            >
              {isTransferring ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isTransferring ? "Initiating Transfer..." : "Confirm and Send"}
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-150 cursor-pointer"
            >
              Edit Transfer
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="w-full max-h-[600px] overflow-y-auto max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-red-600 mx-3">
          {/* Success Header and Icon */}
          <div className="flex flex-col items-center text-center p-6 space-y-3 relative">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 border-4 border-red-300 flex items-center justify-center ">
              {/* Using red accents for the success checkmark */}
              <button
                onClick={() => setExternalTransfer(false)}
                className="absolute top-4 right-4 cursor-pointer"
              >
                <svg
                  className="fill-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  height="30px"
                  viewBox="0 -960 960 960"
                  width="30px"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </button>
              <CheckIcon className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Transfer Confirmed!
            </h2>
            <p className="text-sm text-gray-600">
              Your transfer has been successfully initiated and is being
              processed.
            </p>
          </div>

          {/* Amount Block - Highlighted */}
          <div className="text-center p-4 bg-gray-100 rounded-b-lg shadow-inner mx-5">
            <p className="text-gray-500 text-sm font-medium">
              Amount Transferred
            </p>
            <p className="text-4xl font-extrabold text-red-600 mt-1">
              {" "}
              $
              {Number(transferAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Main Summary Content */}
          <div className="p-5 space-y-4">
            {/* Detailed Rows */}
            <div className="border border-gray-200 rounded-lg p-3">
              <h3 className="text-md font-bold text-gray-800 mb-2 border-b pb-2">
                Transaction Details
              </h3>

              <SummaryRow
                label="From Account"
                value={`${
                  external.fullName
                } (****${external.accountNumber.slice(-4)})`}
              />
              <SummaryRow
                label="To Account"
                value={`${
                  currentUser.accountType
                } (****${currentUser.accountNumber.slice(-4)})`}
              />
              <SummaryRow label="Expected Arrival" value={"5 - 10 mins"} />
              <SummaryRow
                label="Reference ID"
                value={`WF-TXN-${generateReference()}`}
              />
              <SummaryRow label="Fee" value="$0.00" />
            </div>

            {/* Action Area */}
            <button
              onClick={() => nav("/account-dashboard/transactions")}
              className="w-full py-3 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-red-600 hover:bg-red-700 transition duration-150 cursor-pointer"
            >
              View Account Activity
            </button>
            <button
              onClick={() => (nav("/account-dashboard/transfer"), setStep(0))}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-150 cursor-pointer"
            >
              Make Another Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferFromExternalAccounts;
