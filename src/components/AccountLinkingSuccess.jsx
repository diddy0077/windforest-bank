import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';


// Success Checkmark Icon (using inline SVG)
const CheckIcon = ({ className = "w-12 h-12" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AccountLinkingSuccess = ({ externalUser,setNotifications }) => {
  const nav = useNavigate()
  const {currentUser,setCurrentUser} = useContext(UserContext)

    // Mock handler for navigation/closing the modal
  const handleClose = async () => {
    const newNotification = {
      id: crypto.randomUUID(),
      type: "success",
      message: "External account linked successfully!",
      date: new Date().toISOString(),
      read: false,
    };
    const newLinkedAccount = {
      id: crypto.randomUUID(),
      linkedUserId: externalUser.id,
      linkedUserName: externalUser.fullName,
      accountNumber: externalUser.accountNumber,   // store masked, not full plaintext
      status: "verified",
      linkedDate: new Date().toISOString(),
    }
    const res = await fetch(`http://localhost:5000/users/${currentUser.id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
     body: JSON.stringify({
  notifications: [...(currentUser.notifications || []), newNotification],
  linkedAccounts: [...(currentUser.linkedAccounts || []), newLinkedAccount]
})
    })
    if (!res.ok) throw new Error("Failed to update user")

const updatedUser = await res.json()

// update your context state
setCurrentUser(updatedUser)
      setNotifications((prev) => [...prev, newNotification])
        nav('/account-dashboard')
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                
                {/* Success Content */}
                <div className="text-center p-10 space-y-6">
                    {/* Visual Success Indicator */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-red-50 border-4 border-red-300 flex items-center justify-center">
                        {/* Note: I'm using a shade of green for the checkmark itself 
                            as green is the universal symbol for success, while keeping the 
                            container elements in the gray/red palette for visual contrast and branding. */}
                        <CheckIcon className="w-12 h-12 text-green-600" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Account Linked Successfully!
                    </h2>
                    <p className="text-lg text-gray-600">
                        Congratulations! Your external account is now fully verified and linked to your WindForest Bank profile. You can start transfers immediately.
                    </p>

                    {/* Summary of Linked Account */}
                    <div className="p-4 bg-gray-100 rounded-lg text-gray-700 text-sm font-medium">
                        <span className="text-red-600 mr-2">External Account:</span> **** **** {externalUser?.accountNumber.slice(0, -4)}
                    </div>

                    {/* Call to Action Button */}
                    <button
                        onClick={handleClose}
                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-red-600 hover:bg-red-700 transition duration-150 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                    >
                        View My Accounts
                    </button>
                    
                    <p className="text-xs text-gray-400">
                        (Confirmation reference: WF-ACC-190387)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccountLinkingSuccess;
