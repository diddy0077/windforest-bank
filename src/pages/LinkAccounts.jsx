import React, { useEffect, useState,useContext } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../components/UserContext';
import ConfirmMicroDepositsCard from '../components/ConfirmMicroDepositsCard';
import AccountLinkingSuccess from '../components/AccountLinkingSuccess';
import { useOutletContext } from 'react-router-dom';



// Mock Icon Component for Visual Appeal (using inline SVG for the bank icon)
const BankIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3m0 0a2 2 0 012-2h2a2 2 0 012 2v3" />
  </svg>
);

const LinkAccounts = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [externalUser, setExternalUser] = useState(null)
  const [error, setError] = useState(null)
  const { currentUser } = useContext(UserContext)
  const [microDepositOne, setMicroDepositOne] = useState(null)
  const [microDepositTwo, setMicroDepositTwo] = useState(null)
  const [step, setStep] = useState(1)
  const { setNotifications } = useOutletContext()
  console.log(setNotifications)
 
 useEffect(() => {
  setError('')
  const fetchUser = async () => {
    const res = await fetch('http://localhost:5000/users')
    const users = await res.json()
    const matchedUser = users.find((user) => Number(user.accountNumber) === Number(accountNumber))
    if (matchedUser) {
      setExternalUser(matchedUser)
    } else if (accountNumber.trim().length !== 0) {
      setExternalUser(null)
      setError('No accounts found with this number!')
    }
  }
  fetchUser()
}, [accountNumber])


function generateRandomDeposit() {
  const min = 0.01;
  const max = 0.99;
  const random = Math.random() * (max - min) + min;
  return Math.round(random * 100) / 100;
}



  const handleLinkAccount = async () => {
   
    if (accountNumber.trim().length === 0) {
      setError("Please enter an account number."); 
      return;
    }
     if (Number(accountNumber) === Number(currentUser.accountNumber)) {
      setError('You cannot link your own account!')
      toast.error('You cannot link your own account!')
      setIsLinking(false)
     } else {
       setIsLinking(true);
        const firstDeposit = generateRandomDeposit()
       const secondDeposit = generateRandomDeposit()
       setMicroDepositOne(firstDeposit)
       setMicroDepositTwo(secondDeposit)
    const deposit1 = {
    fromUserId: '',
    fromUserName: 'WindForest Bank',
    toUserId: externalUser.id,
    toUserName: externalUser.fullName,
    amount: firstDeposit,
    date: new Date().toISOString(),
    balanceAfterSender: '',
    balanceAfterReceiver: externalUser.accountBalance + firstDeposit
    }
      const deposit2 = {
    fromUserId: '',
    fromUserName: 'WindForest Bank',
    toUserId: externalUser.id,
    toUserName: externalUser.fullName,
    amount: secondDeposit,
    date: new Date().toISOString(),
    balanceAfterSender: '',
    balanceAfterReceiver: externalUser.accountBalance + secondDeposit
    }
    try {
      const res = await fetch('http://localhost:5000/transactions', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify( [deposit1])
      })
      if (!res.ok) {
        throw {
          message: 'Error sending micro-deposits'
        }
      }
       const res2 = await fetch('http://localhost:5000/transactions', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(deposit2)
      })
      if (!res2.ok) {
        throw {
          message: 'Error sending micro-deposits'
        }
      }
      const newNotification1 = {
         id: crypto.randomUUID(),
        type: "success",
        message: `You received $${firstDeposit} from WindForest Bank.`,
        date: new Date().toISOString(),
        read: false,
      }
       const newNotification2 = {
         id: crypto.randomUUID(),
        type: "success",
        message: `You received $${secondDeposit} from WindForest Bank.`,
        date: new Date().toISOString(),
        read: false,
      }
      const res3 = await fetch(`http://localhost:5000/users/${externalUser.id}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...externalUser, notifications: [...externalUser.notifications, newNotification1,newNotification2]})
      })
      if (!res3) {
         throw {
          message: 'Error sending micro-deposits'
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success('Two micro-deposits have been successfully sent to the target account. Please ask the account owner to verify the amounts to complete linking.')
      setStep(2)
      setAccountNumber('')
    }
    catch (error) {
      console.log('Error sending micro deposits!', error)
      toast.error('Error sending micro deposits!')
    }
    finally {
      setIsLinking(false);
    }
    }
   
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 w-full">
      {step === 1 && <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        
       
        <div className="flex items-center p-6 bg-red-600 text-white rounded-t-xl">
          <BankIcon className="w-8 h-8 mr-3" />
          <h2 className="text-2xl font-bold tracking-tight">
            Link External Account
          </h2>
        </div>

       
        <div className="p-8 space-y-6">
          <p className="text-gray-600 text-md leading-relaxed">
            Securely link an external account using your account number. We will confirm ownership by sending two small micro-deposits (less than $1.00) that will arrive immediately.
          </p>

          
          <div>
            <label 
              htmlFor="accountNumber" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              External Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))} 
              placeholder="e.g., 123456789"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 text-gray-800 transition duration-150 shadow-sm"
              disabled={isLinking}
            />
            <p className="mt-2 text-xs text-gray-500">
              Note: This is the account number of your external bank account.
            </p>
          </div>

          
        {error &&  <p className='text-sm text-red-600'>{error}</p>}
          
           {externalUser && externalUser.fullName && (
  <div>
    <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700 mb-2">
      Account Name
    </label>
    <input
      type="text"
      value={externalUser.fullName}
      disabled
      className="w-full p-3 border-2 border-gray-300 bg-gray-100 rounded-lg text-gray-800 cursor-not-allowed"
    />
  </div>
)}
          
          <button
            onClick={handleLinkAccount}
            disabled={isLinking || accountNumber.trim().length === 0}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 transition duration-150 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
          >
            {isLinking ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLinking ? 'Initiating Micro-Deposits...' : 'Link Account'}
          </button>
        </div>
      </div>}
      {step === 2 && <ConfirmMicroDepositsCard microDepositOne={microDepositOne} microDepositTwo={microDepositTwo} setStep={setStep} externalUser={externalUser} />}
      {step === 3 && <AccountLinkingSuccess externalUser={externalUser} setNotifications={setNotifications} />}
    </div>
  );
};

export default LinkAccounts;
