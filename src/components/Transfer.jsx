import { useState,useEffect } from "react";
import AddBeneficiaryModal from "./AddBeneficiaryModal";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";
import TransferSummaryModal from "./TransferSummaryModal";
import { useOutletContext } from 'react-router-dom';
import { addNotification } from "./utils";

const Transfer = () => {

 
  const [beneficiaryForm, setBeneficiaryForm] = useState("");
  const { currentUser } = useContext(UserContext);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fromAccount, setFromAccount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [transferBeneficiary, setTransferBeneficiary] = useState(null)
  const { setIsSidebarOpen,setNotifications } = useOutletContext();
  const deleteBeneficiary = async (accountNumber) => {
    const newBeneficiaries = beneficiaries.filter((b) => {
      return b.accountNumber !== accountNumber;
    });
    setBeneficiaries(newBeneficiaries);
    const prevBeneficiaries = beneficiaries;
    const notification = {
  id: crypto.randomUUID(),
  type: 'success',
  message: 'Beneficiary deleted successfully!',
  date: new Date().toISOString(),
  read: false,
};
setNotifications(prev => [...prev, notification]);

    try {
      const res = await fetch(`http://localhost:5000/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beneficiaries: newBeneficiaries,notifications: [...currentUser.notifications, notification]}),
      });
      const data = await res.json();
      console.log("PATCH response:", data);
      setBeneficiaries(data.beneficiaries);
      toast.success("Beneficiary deleted successfully!");
    } catch (error) {
      console.log("Error deleting beneficiary", error);
      setBeneficiaries(prevBeneficiaries);
    }
  };

  function mask(num) {
    const str = num.toString();
    const last4 = str.slice(-4); // last 4 digits
    const masked = "*".repeat(str.length - 4); // mask the rest
    return masked + last4;
  }

  const transferMoney = () => {
    if (!amount) {
      toast.error('Please enter a valid amount!')
      return
    }
    if (!fromAccount) {
      toast.error('Please selected a valid account to transfer from!')
      return
    }
    if (!toAccount) {
      toast.error('Please selected a valid beneficiary account!')
      return
    }
    if (amount < 100) {
      toast.error('Amount cannot be less than $100!')
      return
    }
    if (amount > currentUser.accountBalance) {
      toast.error('Insufficient account balance!')
      return
    }
    const fullBeneficiary = beneficiaries.find((b) => b.accountNumber === toAccount)
    setTransferBeneficiary(fullBeneficiary)
    setIsOpen(true)
  }

  useEffect(() => {
    const fetchBeneficary = async () => {
      try {
        const res = await fetch(`http://localhost:5000/users/${currentUser.id}`)
        if (!res.ok) {
          throw {
            message: 'Error fetching beneficiaries'
          }
        }
        const data = await res.json()
        console.log(data)
        setBeneficiaries(data.beneficiaries)
      }
      catch (error) {
        console.log("Error fetching beneficiaries",error)
      }
    }
    fetchBeneficary()
  },[currentUser.id])


  return (
    <div className=" bg-white shadow-lg rounded-2xl p-6 sm:p-8 my-6 md:w-[80%] w-[95%] mx-auto">
      <div className="flex flex-col md:flex-row justify-between">
        <div className='flex items-center gap-3 mb-8'>
        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
        </button>
         <h2 className="text-xl font-semibold text-gray-800">Transfer Funds</h2>
      </div>
        <button
          onClick={() => setBeneficiaryForm(true)}
          style={{
            background: "linear-gradient(45deg, #1f2937, #4b5563)",
          }}
          className="self-end text-white text-sm md:text-md cursor-pointer font-semibold active:scale-[0.95] transition duration-300 p-2 px-4 rounded-lg mb-6 md:mb-0"
        >
          + Add Beneficiary
        </button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Account
            </label>
            <select onChange={(e) => setFromAccount(e.target.value)} value={fromAccount} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Select an account</option>
              <option value={currentUser.accountNumber}>
                {currentUser.accountType} ({mask(currentUser.accountNumber)}) - $
                {currentUser.accountBalance.toLocaleString()}
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Account
            </label>
            <select onChange={(e) => setToAccount(e.target.value)} value={toAccount} className="w-[100%] p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Select an account or beneficiary</option>
              {beneficiaries.map((b) => (
                <option className="w-full whitespace-wrap" key={b.accountNumber} value={b.accountNumber}>
                  Beneficiary: {b.name} ({mask(b.accountNumber)})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button onClick={transferMoney} className="cursor-pointer w-full py-4 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition-colors">
          Complete Transfer
        </button>
      </div>
      <section className="mt-6">
        {beneficiaries.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">My Beneficiaries</h2>

            <div className="flex flex-col gap-3">
              {beneficiaries.map((c) => {
                return (
                  <div className="p-4 bg-gray-50  rounded-lg shadow flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{c.name}</p>
                      <p className="text-sm text-gray-500">
                        Acct: {c.accountNumber}
                      </p>
                      <p className="text-xs text-gray-400">
                        Added on: {new Date(c?.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteBeneficiary(c.accountNumber)}
                      className="text-white font-medium cursor-pointer active:scale-[0.95] transition duration-300 text-sm bg-red-600 p-3 py-2 rounded-lg shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-slate-700">
            No beneficiaries added yet, Beneficiaries will appear here.
          </p>
        )}
      </section>

       <TransferSummaryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        accountNumber={currentUser.accountNumber}
        accountType={currentUser.accountType}
        transferBeneficiary={transferBeneficiary}
        setAmount={setAmount}
        setToAccount={setToAccount}
        setFromAccount={setFromAccount}
        setTransferBeneficiary={setTransferBeneficiary}
        setIsOpen={setIsOpen}
        amount={amount}
        addNotification={addNotification}
        setNotifications={setNotifications}
      />

      <AddBeneficiaryModal
        beneficiaryForm={beneficiaryForm}
        setBeneficiaryForm={setBeneficiaryForm}
        setBeneficiaries={setBeneficiaries}
        beneficiaries={beneficiaries}
        setNotifications={setNotifications}
      />
    </div>
  );
};

export default Transfer;
