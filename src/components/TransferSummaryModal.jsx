import React from "react";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";
import TransferSuccessModal from "./TransferSuccessModal";

export default function TransferSummaryModal({
  isOpen,
  onClose,
  accountNumber,
  accountType,
  transferBeneficiary,
  amount,
  setAmount,
  setFromAccount,
  setToAccount,
  setTransferBeneficiary,
  setIsOpen,
  addNotification,
  setNotifications,
}) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  function calculateTotal(amount) {
    const total = Number(amount) + 2;
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  const confirmTransfer = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:5000/users/${currentUser.id}`);
    const currentUserData = await res.json();
    const res2 = await fetch(
      `http://localhost:5000/users/?accountNumber=${transferBeneficiary.accountNumber}`
    );
    const beneficiaryDataArray = await res2.json();
    const beneficiaryData = beneficiaryDataArray[0];
    const newCurrentUserBalance =
      currentUserData.accountBalance - Number(amount);
    const newBeneficiaryBalance =
      beneficiaryData.accountBalance + Number(amount);
    const updatedCurrentUser = {
      ...currentUserData,
      accountBalance: newCurrentUserBalance,
    };
    setCurrentUser(updatedCurrentUser);
    try {
      const response = await fetch(
        `http://localhost:5000/users/${currentUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountBalance: newCurrentUserBalance }),
        }
      );
      if (!response.ok) {
        throw {
          message: "Error Updating Current User balance",
        };
      }
      console.log(beneficiaryData.id)
      const response2 = await fetch(
        `http://localhost:5000/users/${beneficiaryData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountBalance: newBeneficiaryBalance }),
        }
      );
      if (!response2.ok) {
        throw {
          message: "Error Updating beneficiary balance",
        };
      }
      const senderNotification = {
        id: crypto.randomUUID(),
        type: "success",
        message: `You successfully transferred $${amount} to ${transferBeneficiary.name}`,
        date: new Date().toISOString(),
        read: false,
      };

      const receiverNotification = {
        id: crypto.randomUUID(),
        type: "success",
        message: `You received $${amount} from ${currentUser.fullName}`,
        date: new Date().toISOString(),
        read: false,
      };
      const updatedSenderNotifications = await addNotification(
        currentUser.id,
        senderNotification
      );
      const updatedReceiverNotifications = await addNotification(
        beneficiaryData.id,
        receiverNotification
      );
      setNotifications(updatedSenderNotifications);
      const transaction = {
        fromUserId: currentUser.id,
        fromUserName: currentUser.fullName,
        toUserId: beneficiaryData.id,
        toUserName: beneficiaryData.fullName,
        amount: amount,
        date: new Date().toISOString(),
        balanceAfterSender: currentUser.accountBalance - Number(amount),
        balanceAfterReceiver: beneficiaryData.accountBalance + Number(amount),
        reversed: false
      };
      const res3 = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });
      if (!res3.ok) {
        throw {
          message: "Error Posting Transaction",
        };
      }
      await new Promise((resolve) => setTimeout(resolve, 3000)); // simulate delay
      setOpenSuccessModal(true);
      toast.success("Transfer Successful!");
    } catch (error) {
      console.log("Error Confirming Transfer", error);
    } finally {
      setLoading(false);
    }
  };
  console.log('currentUser.id', currentUser.id);
console.log('transferBeneficiary', transferBeneficiary);

  function closeTransfer() {
    setAmount("");
    setFromAccount("");
    setToAccount("");
    setTransferBeneficiary(null);
    setIsOpen(false);
    setOpenSuccessModal(false);
  }

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {/* Header */}
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Transfer Summary</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl font-bold hover:text-gray-200"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <div className="flex justify-between border-b border-b-gray-400 pb-2">
            <span className="text-gray-600 font-medium">From Account:</span>
            <span className="font-semibold text-gray-900">
              {accountType} - {accountNumber}
            </span>
          </div>
          <div className="flex justify-between border-b border-b-gray-400 pb-2">
            <span className="text-gray-600 font-medium">To Account:</span>
            <span className="font-semibold text-gray-900">
              {transferBeneficiary?.name} - {transferBeneficiary?.accountNumber}
            </span>
          </div>
          <div className="flex justify-between border-b border-b-gray-400 pb-2">
            <span className="text-gray-600 font-medium">Amount:</span>
            <span className="font-semibold text-gray-900">
              {Number(amount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>
          <div className="flex justify-between border-b border-b-gray-400 pb-2">
            <span className="text-gray-600 font-medium">Transfer Fee:</span>
            <span className="font-semibold text-gray-900">$2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Total Debit:</span>
            <span className="font-bold text-red-600">
              {calculateTotal(amount)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="cursor-pointer active:
          scale-[0.95] duration-300 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmTransfer}
            className="cursor-pointer active:
          scale-[0.95] duration-300 px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            {loading ? "Confirming transfer..." : " Confirm Transfer"}
          </button>
        </div>
      </div>

      <TransferSuccessModal
        isOpen={openSuccessModal}
        onClose={closeTransfer}
        amount={amount}
        recipient={transferBeneficiary?.name}
        setToAccount={setToAccount}
        setFromAccount={setFromAccount}
        setAmount={setAmount}
        setIsOpen={setIsOpen}
      />
    </div>
  );
}
