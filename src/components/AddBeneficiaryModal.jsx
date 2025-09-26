import React, { useState } from "react";
import { useContext } from 'react';
import { UserContext } from './UserContext';
import { toast } from "react-toastify";
import { addNotification } from "./utils";

export default function AddBeneficiaryModal({beneficiaryForm, setBeneficiaryForm,setBeneficiaries,beneficiaries,setNotifications}) {
  const [accountNumber, setAccountNumber] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useContext(UserContext);

  const handleLookup = async (value) => {
    setAccountNumber(value);
    setError("");
    setBeneficiaryName("");
    
    if (value.length >= 6) {
      try {
        const res = await fetch("http://localhost:5000/users");
        const users = await res.json();
        const found = users.find((u) => u.accountNumber === value);

        if (found) {
          setBeneficiaryName(found.fullName);
        } else {
          setError("No account found with this number.");
        }
      } catch (err) {
        setError("Error fetching account info.",err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!beneficiaryName) {
      setError("Please enter a valid account.");
      return;
    }
    const exists = beneficiaries.some(b => b.accountNumber === accountNumber)
    if (exists) {
      toast.error("Beneficiary already exists!");
      return;
    }
    try {
       const newBeneficiary = {
  accountNumber,
  name: beneficiaryName,
  addedAt: new Date().toISOString(),
      };
          const notification = {
  id: crypto.randomUUID(),
  type: 'success',
  message: `Beneficiary ${beneficiaryName} added successfully!`,
  date: new Date().toISOString(),
  read: false,
};
setNotifications(prev => [...prev, notification]);

   const updatedArray = [...beneficiaries, newBeneficiary]
    const res = await fetch(`http://localhost:5000/users/${currentUser.id}`, 
      {
        method: 'PATCH',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({beneficiaries: updatedArray,notifications: [...currentUser.notifications, notification]
 })
      }
      );
    const data = await res.json()
      setBeneficiaries(data.beneficiaries)
      setAccountNumber("")
      setBeneficiaryName("")
      setError("")
      setBeneficiaryForm(false);
      toast.success("Beneficiary Added successfully!");
    }
    catch (error) {
      console.log("Error saving beneficiary", error)
    }
  };

  return (
    <div
  className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300
    ${beneficiaryForm ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
  `}
>
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100">
    <h2 className="text-xl font-bold text-red-700 mb-4">Add Beneficiary</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Account Number */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Account Number
        </label>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => handleLookup(e.target.value)}
          placeholder="Enter beneficiary account number"
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Beneficiary Name */}
      {beneficiaryName && (
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Beneficiary Name
          </label>
          <input
            type="text"
            value={beneficiaryName}
            disabled
            className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
          />
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => setBeneficiaryForm(false)}
          className="px-4 cursor-pointer py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="cursor-pointer px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
        >
          Add Beneficiary
        </button>
      </div>
    </form>
  </div>
</div>

  );
}
