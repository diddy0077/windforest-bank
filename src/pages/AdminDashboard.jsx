import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Shield, CheckCircle, XCircle, ChevronDown, ChevronUp, AlertTriangle, RefreshCw, Smartphone, Mail, MapPin, Briefcase, DollarSign, CreditCard, Banknote } from 'lucide-react';
import { UserContext } from '../components/UserContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';

// =======================================================================
// --- MOCK DATA SOURCE ---
// Updated to reflect the new, detailed schema
// =======================================================================


const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <p className="ml-3 text-red-600 font-medium">Admin Loading...</p>
    </div>
);

/**
 * Renders a stylized button using the brand's primary color.
 */
const BrandButton = ({ children, onClick, disabled = false, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
            disabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
        } ${className}`}
    >
        {children}
    </button>
);

/**
 * Main application component.
 */
const AdminDashboard = () => {
    // Fixed user ID for mock environment
    const userId = 'admin-user-mock-12345'; 
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { logout,currentUser,setCurrentUser } = useContext(UserContext)
    console.log(users)

  
    useEffect(() => {
        setIsLoading(true) 
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:5000/users') 
                if (!res.ok) {
                    throw {
                        message: 'Error fetching users'
                    }
                }
                 const res2 = await fetch('http://localhost:5000/onlineAccessUsers') 
                if (!res.ok) {
                    throw {
                        message: 'Error fetching onlineUsers'
                    }
                }
                const res3 = await fetch('http://localhost:5000/transactions')
                 if (!res3.ok) {
                    throw {
                        message: 'Error fetching transactions'
                    }
                }
                const transactions = await res3.json()
                const users = await res.json()
                const onlineAccessUsers = await res2.json()
                await new Promise((resolve) => setTimeout(resolve, 3000)); 
             const  fullUserArray = users.map(user => {
   const matchedOnline = onlineAccessUsers.find(u => u.userId === user.id)
    return { ...user, onlineAccess: matchedOnline || null }
             })
               const fullUserArrayWithTx = fullUserArray.map(user => ({
  ...user,
  transactions: transactions.filter(tx => tx.fromUserId === user.id || tx.toUserId === user.id)
}));
                setUsers(fullUserArrayWithTx)
             console.log(fullUserArrayWithTx)
            }
            catch (error) {
                console.log('Error fetching users', error)
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchUsers()
    }, []);

    

const toggleTransferRestriction = async (user) => {
  const newStatus = !user.isTransferEnabled;

  const notification = {
    id: crypto.randomUUID(),
    type: !newStatus ? "warning" : "success",
    message: !newStatus
      ? "You have been restricted from making transfers!"
      : "Your transfer access has been restored!",
    date: new Date().toISOString(),
    read: false,
  };

  try {
    // 1. Update user’s transfer status
    const res = await fetch(`http://localhost:5000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isTransferEnabled: newStatus,notifications: [...user.notifications, notification] }),
    });

    if (!res.ok) throw new Error("Failed to update transfer status");

    // 3. Update local state
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, isTransferEnabled: newStatus } : u
      )
    );

    setSelectedUser((prev) =>
      prev?.id === user.id ? { ...prev, isTransferEnabled: newStatus } : prev
    );


 if (currentUser?.id === user.id) {
  const updatedUser = { ...currentUser, isTransferEnabled: newStatus };
  setCurrentUser(updatedUser);
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));
}
    console.log("Transfer status + notification updated successfully");
  } catch (error) {
    console.log("Error:", error);
  }
};




   const patchUser = async (id, updates) => {
  return fetch(`http://localhost:5000/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });
};

   
const reverseTransaction = async (user, tx) => {
  try {
    const sender = await fetchUser(tx.fromUserId);
    const receiver = await fetchUser(tx.toUserId);
    const amount = Number(tx.amount);

    if (tx.reversed) {
      toast.error("This transaction has already been reversed!");
      return;
    }

    // --- Backend updates ---
    const newSenderBalance = sender.accountBalance + amount;
    const newReceiverBalance = receiver.accountBalance - amount;

    const senderNotification = {
  id: crypto.randomUUID(),
  type: "success",
  message: `A reversal of $${tx.amount} has been credited back to your account from ${receiver.fullName}.`,
  date: new Date().toISOString(),
  read: false,
      };
      const receiverNotification = {
  id: crypto.randomUUID(),
  type: "info",
  message: `A reversal of $${tx.amount} has been debited from your account and returned to ${sender.fullName}.`,
  date: new Date().toISOString(),
  read: false,
};

    await patchUser(receiver.id, { accountBalance: newReceiverBalance,notifications: [...receiver.notifications, receiverNotification] });
    await patchUser(sender.id, { accountBalance: newSenderBalance, notifications: [...sender.notifications, senderNotification] });

    await fetch(`http://localhost:5000/transactions/${tx.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reversed: true })
    });
    setSelectedUser(prev => ({ ...prev, isTransferEnabled: !prev.isTransferEnabled }));

    // --- Local state update ---
   setUsers(prevUsers => {
  const updatedUsers = prevUsers.map(u => {
    let updatedBalance = u.accountBalance;
    if (u.id === sender.id) updatedBalance = newSenderBalance;
    if (u.id === receiver.id) updatedBalance = newReceiverBalance;

    const updatedTxs = u.transactions.map(t =>
      t.id === tx.id ? { ...t, reversed: true } : t
    );

    return {
      ...u,
      accountBalance: updatedBalance,
      transactions: updatedTxs
    };
  });

  setSelectedUser(prev =>
    prev ? updatedUsers.find(u => u.id === prev.id) : prev
  );

  return updatedUsers;
});
    toast.success(`Transaction of $${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} reversed successfully!`);
  } catch (err) {
    console.error("Error reversing transaction:", err);
  }
};




const fetchUser = async (id) => {
  const res = await fetch(`http://localhost:5000/users/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch user with id ${id}`);
  return res.json();
};



    if (isLoading || !userId) {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
            <header className="mb-8 flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-red-700 flex items-center">
                        <Shield className="w-8 h-8 mr-3 text-red-600" />
                        Bank Admin Panel
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Managing all users and performing actions.
                    </p>
                    
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Admin ID:</p>
                    <p className="font-mono text-xs text-red-600 bg-red-100 p-1 rounded-md">{userId}</p>
                    <button onClick={logout} className='bg-red-600 p-3 text-white font-semibold py-2 rounded-full shadow-md mt-4 cursor-pointer'>Logout</button>
                </div>
            </header>

            {/* Custom Alert Box */}
            <div id="admin-alert" className="hidden fixed top-4 right-4 bg-red-600 text-white p-3 rounded-lg shadow-xl z-50 transition-opacity duration-300"></div>

            <UserTable 
                users={users} 
                setSelectedUser={setSelectedUser} 
                setShowModal={setShowModal}
            />

            {showModal && selectedUser && (
                <UserActionsModal
                    user={selectedUser}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedUser(null);
                    }}
                    toggleRestriction={toggleTransferRestriction}
                    reverseTransaction={reverseTransaction}
                />
            )}
        </div>
    );
};

// --- User Table Component ---
const UserTable = ({ users, setSelectedUser, setShowModal }) => {
    
    // Helper function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const openDetailsModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-gray-200">
            <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800">All Bank Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-red-50"> 
                        <tr>
                            {/* Changed column header to Full Name */}
                            <th className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">User ID / Full Name</th> 
                            <th className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">Email</th>
                            {/* Changed column header to Account Balance */}
                            <th className="px-6 py-3 text-right text-xs font-bold text-red-800 uppercase tracking-wider">Account Balance</th> 
                            <th className="px-6 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">Transfer Status</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-red-800 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.userId} className="hover:bg-red-50/20 transition duration-150 ease-in-out">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Using user.fullName */}
                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div> 
                                    <div className="text-xs text-gray-500 font-mono break-all">{user?.onlineAccess?.username}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold"
                                    // Using user.accountBalance
                                    style={{ color: user.accountBalance < 0 ? '#b91c1c' : '#10b981' }} 
                                >
                                    {/* Using user.accountBalance */}
                                    {formatCurrency(user.accountBalance)} 
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.isTransferEnabled ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800">
                                            <CheckCircle className="w-3 h-3 mr-1" /> Enabled
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-xs font-medium text-red-800">
                                            <XCircle className="w-3 h-3 mr-1" /> Restricted
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <BrandButton 
                                        onClick={() => openDetailsModal(user)} 
                                        className="py-1 px-3 text-sm"
                                    >
                                        Details & Actions
                                    </BrandButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {users.length === 0 && (
                <div className="p-10 text-center text-gray-500">
                    <p className="text-lg">No bank users found in the database.</p>
                </div>
            )}
        </div>
    );
};

// --- Helper for displaying detail items ---
const DetailItem = ({ icon: Icon, title, value }) => (
    <div className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
        <Icon className="w-5 h-5 text-red-500 flex-shrink-0" />
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
            <p className="text-sm font-semibold text-gray-800 break-words max-w-[150px]">{value}</p>
        </div>
    </div>
);

// --- User Actions Modal Component ---
const UserActionsModal = ({ user, onClose, toggleRestriction, reverseTransaction }) => {
    const [expandedTxs, setExpandedTxs] = useState({});

    // Helper to toggle transaction detail visibility
    const toggleTxExpand = (txId) => {
        setExpandedTxs(prev => ({ ...prev, [txId]: !prev[txId] }));
    };

    // Helper function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Determine the type icon and color
    const getTxIcon = (user,tx) => {
        if (user.id === tx.fromUserId) {
            return { icon: XCircle, color: 'text-red-600' } ;
        } else if (user.id === tx.toUserId ) {
           return { icon: CheckCircle, color: 'text-green-600' };
        } else {
           return { icon: AlertTriangle, color: 'text-gray-600' };
        }
       
    };

    // Sort transactions by date descending
    const sortedTransactions = useMemo(() => {
        return [...user.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [user.transactions]);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <header className="p-6 border-b flex justify-between items-center bg-red-600 text-white rounded-t-xl">
                    <h2 className="text-2xl font-bold flex items-center">
                        <User className="w-6 h-6 mr-2" />
                        User Profile: {user.fullName}
                    </h2>
                    <button onClick={onClose} className="cursor-pointer text-white hover:text-gray-200">
                        <XCircle className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Info & Actions Card (Span 1/3) */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Current Balance */}
                        <div className="p-5 rounded-xl border-4 border-red-100 shadow-lg">
                            <p className="text-md font-semibold text-gray-600">Current Account Balance ({user.accountType})</p>
                            <p className="text-4xl font-extrabold mt-1" style={{ color: user.accountBalance < 0 ? '#b91c1c' : '#10b981' }}>
                                {formatCurrency(user.accountBalance)}
                            </p>
                            <p className="text-sm font-mono text-gray-500 mt-2">Acct #: {user.accountNumber}</p>
                        </div>

                        {/* Restriction Control */}
                        <div className={`p-4 rounded-xl border-2 ${user.isTransferEnabled ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
                            <p className="text-lg font-bold flex items-center mb-2">
                                <Shield className="w-5 h-5 mr-2" />
                                Transfer Control
                            </p>
                            <p className={`font-semibold ${user.isTransferEnabled ? 'text-green-700' : 'text-red-700'} mb-3`}>
                                Status: {user.isTransferEnabled ? 'ENABLED' : 'RESTRICTED'}
                            </p>
                            <BrandButton 
                                onClick={() => toggleRestriction(user)}
                                className={`w-full ${user.isTransferEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}`}
                            >
                                {user.isTransferEnabled ? 'Restrict Transfers' : 'Enable Transfers'}
                            </BrandButton>
                            <p className="mt-2 text-xs text-gray-600">
                                Instantly allows or blocks outgoing transactions.
                            </p>
                        </div>
                    </div>

                    {/* Detailed User Information (Span 2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">User Details</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <DetailItem icon={User} title="Full Name" value={user.fullName} />
                            <DetailItem icon={Banknote} title="Account Type" value={user.accountType} />
                            <DetailItem icon={Calendar} title="D.O.B" value={user.dob} />
                            <DetailItem icon={Shield} title="SSN" value={user?.ssn} />
                            <DetailItem icon={Smartphone} title="Phone" value={user.phone} />
                            <DetailItem icon={Mail} title="Email" value={user.email} />
                            <DetailItem icon={MapPin} title="Address" value={user.address} />
                            <DetailItem icon={Briefcase} title="Employment Status" value={user.employment} />
                            <DetailItem icon={DollarSign} title="Income" value={`$${user.income}`} />
                            <DetailItem icon={CreditCard} title="Debit Card" value={user.debitCard ? 'Active' : 'Inactive'} />
                            <DetailItem icon={Laptop} title="Online Banking" value={user.onlineBanking ? 'Active' : 'Inactive'} />
                            <DetailItem icon={Home} title="Employer" value={user.employerName} />
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-8">Transaction History ({user.transactions.length})</h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                            {sortedTransactions.map((tx) => {
                                const { icon: Icon, color } = getTxIcon(user,tx);
                                return (
                                    <div key={tx.id} className={`p-3 rounded-lg border transition duration-150 ${tx.reversed ? 'bg-gray-100 border-gray-300' : 'bg-white hover:bg-red-50/50'}`}>
                                        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleTxExpand(tx.id)}>
                                            <div className="flex items-center">
                                                <Icon className={`w-5 h-5 mr-3 ${color}`} />
                                                <span className={`font-semibold capitalize ${tx.reversed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                    {tx.fromUserId === user.id ? 'Debit' : 'Credit'}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`font-bold text-lg mr-4 ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {formatCurrency(tx.amount)}
                                                </span>
                                                {expandedTxs[tx.id] ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                            </div>
                                        </div>

                                        {expandedTxs[tx.id] && (
                                            <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                                                <p className="text-gray-600">Date: {tx.date ? new Date(tx.date).toLocaleString() : 'N/A'}</p>
                                                <p className="text-gray-600">Transaction ID: <span className="font-mono text-xs">{tx.id}</span></p>
                                                
                                                <div className="mt-3">
                                                    {!tx.reversed ? (
                                                        <BrandButton 
                                                            onClick={() => reverseTransaction(user, tx)}
                                                            className="bg-red-600 hover:bg-red-700 py-1 px-3 text-sm flex items-center"
                                                        >
                                                            <RefreshCw className="w-3 h-3 mr-1" /> Reverse Transaction
                                                        </BrandButton>
                                                    ) : (
                                                        <p className="text-red-600 font-semibold flex items-center">
                                                            <AlertTriangle className="w-4 h-4 mr-1" /> Reversal completed.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <footer className="p-4 border-t flex justify-end">
                    <button onClick={onClose} className="cursor-pointer text-gray-600 hover:text-gray-800 font-semibold p-2">
                        Close Panel
                    </button>
                </footer>
            </div>
        </div>
    );
};

// Simple utility icons used only in the modal details that need to be imported
const Calendar = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const Laptop = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="15" x2="22" y2="15"/><line x1="2" y1="19" x2="22" y2="19"/></svg>;
const Home = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 12l10 5 10-5"/><path d="M2 17l10 5 10-5"/></svg>;

// Export the main component
export default AdminDashboard;
