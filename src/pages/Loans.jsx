import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../components/UserContext';
import LoginRequiredCard from '../components/LoginRequired';
import { useLocation } from 'react-router-dom';
import LoanSubmittedCard from '../components/LoanSubmittedCard';
import { Link } from 'react-router-dom';

// --- Mock Icons (for single-file environment) ---
const CalculatorIcon = () => (
    <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v3m0-3v-4m0 4h3m-3-4H9m0 0V9m0 4v3m0-3h3m-3-4V7a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2h-8a2 2 0 01-2-2V7z"></path>
    </svg>
);
const MoneyIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 012-2h2m0 0l-3-3m3 3l-3 3"></path>
    </svg>
);
const GraduationIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 10V18m0-4V10"></path>
    </svg>
);
const CarIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10a2 2 0 012-2h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"></path>
        <circle cx="7.5" cy="18.5" r="1.5"></circle>
        <circle cx="16.5" cy="18.5" r="1.5"></circle>
    </svg>
);

// Mock Loan Data

// --- Loan Calculator Logic ---
const calculateMonthlyPayment = (principal, annualRate, years) => {
    if (!principal || !annualRate || !years) return 0;

    const rate = (annualRate / 100) / 12; // Monthly interest rate
    const payments = years * 12; // Total number of payments

    if (rate === 0) {
        return principal / payments; // Simple division if 0% interest
    }

    const numerator = rate * Math.pow(1 + rate, payments);
    const denominator = Math.pow(1 + rate, payments) - 1;
    
    return principal * (numerator / denominator);
};

// --- Main Components ---
const LoanProductCard = ({ loan, onSelect,icon }) => (
    <div>
        {loan && <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 flex flex-col">
        <div className="flex items-center text-red-600 mb-4">
      <div>{icon}</div>
            <h3 className="text-2xl font-bold ml-3 text-gray-800">{loan.name}</h3>
        </div>
        <p className="text-gray-600 mb-4 flex-grow">{loan.description}</p>
        <div className="grid grid-cols-2 gap-y-2 text-sm border-t pt-4 border-gray-100">
            <span className="font-semibold text-gray-700">Interest Rate:</span>
            <span className="font-bold text-red-600">{loan?.rate?.toFixed(2)}% APR</span>
            
            <span className="font-semibold text-gray-700">Max Amount:</span>
            <span className="font-bold text-gray-800">${loan?.maxAmount?.toLocaleString()}</span>
            
            <span className="font-semibold text-gray-700">Max Term:</span>
            <span className="font-bold text-gray-800">{loan.term}</span>
        </div>
        <button 
            onClick={() => onSelect(loan)}
            className="mt-6 w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md cursor-pointer"
        >
            Calculate Payment
        </button>
    </div>}
    </div>
);

const LoanCalculator = ({ selectedLoan,setIsOpen,setConfirm }) => {
    const {currentUser} = useContext(UserContext)
  const defaultAmount = 10000;
  const defaultTerm = 5;
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(defaultAmount);
  const [years, setYears] = useState(defaultTerm);

  // if no loan is selected yet
  if (!selectedLoan) return <p className="text-gray-500">Select a loan to calculate.</p>;

  const monthlyPayment = calculateMonthlyPayment(amount, selectedLoan.rate, years);

  // 🔥 Apply handler
    const handleApply = async () => {
      setLoading(true)
    try {
       // 👈 save userId at login
      if (!currentUser) {
       sessionStorage.setItem("pendingLoan", JSON.stringify({
    loanId: selectedLoan.id,
    amount,
    years,
  }));
  setIsOpen(true); // show modal
  return;
      }

      // Build loan application object
      const newLoan = {
        loanId: selectedLoan.id,
        loanName: selectedLoan.name,
        amount,
        years,
        monthlyPayment,
        status: "pending",
        appliedAt: new Date().toISOString(),
      };

      // Get current user
      const res = await fetch(`http://localhost:5000/users/${currentUser.id}`);
      if (!res.ok) throw new Error("User not found");
      const user = await res.json();

      // Update user with new loan
      const updatedUser = {
        ...user,
        loans: [...(user.loans || []), newLoan],
      };

      await fetch(`http://localhost:5000/users/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setConfirm(true)
    } catch (err) {
      console.error(err);
      alert("Error applying for loan.");
        }
    finally {
        setLoading(false)
        }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border-t-4 border-gray-800">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <CalculatorIcon /> Loan Payment Estimator
      </h2>

      <div className="space-y-6">
        {/* Interest Rate */}
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-500 mb-1">Annual Interest Rate (APR)</label>
          <p className="text-2xl font-extrabold text-red-600">{selectedLoan.rate.toFixed(2)}%</p>
        </div>

        {/* Loan Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (${amount.toLocaleString()})
          </label>
          <input
            id="amount"
            type="range"
            min="1000"
            max={selectedLoan.maxAmount}
            step="1000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-red-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$1,000</span>
            <span>${selectedLoan.maxAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Repayment Period */}
        <div>
          <label htmlFor="years" className="block text-sm font-medium text-gray-700 mb-2">
            Repayment Period ({years} Years)
          </label>
          <input
            id="years"
            type="range"
            min="1"
            max={selectedLoan.term}
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-red-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 Year</span>
            <span>{selectedLoan.term} Years</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center bg-red-50 p-4 rounded-lg">
        <p className="text-lg font-medium text-gray-700">Estimated Monthly Repayment</p>
        <p className="text-5xl font-extrabold text-red-600 mt-1">
          ${monthlyPayment > 0 ? monthlyPayment.toFixed(2).toLocaleString() : "0.00"}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          *Estimate based on {years} years and a ${amount.toLocaleString()} principal.
        </p>
      </div>

      <button
        onClick={handleApply}
        className="mt-6 w-full py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors shadow-xl cursor-pointer"
      >
        {loading ? 'Processing...' : 'Apply for this Loan'}
      </button>
    </div>
  );
};


// --- Main Page Component ---
const LoanProductsPage = () => {
     const [LOAN_PRODUCTS, setLOAN_PRODUCTS] = useState([])
const [selectedLoan, setSelectedLoan] = useState(null);
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation();
    const [confirm, setConfirm] = useState(false)

useEffect(() => {
  if (location.state?.pendingLoan && LOAN_PRODUCTS.length > 0) {
    const match = LOAN_PRODUCTS.find(l => l.id === location.state.pendingLoan.loanId);
    if (match) {
      setSelectedLoan(match);
    }
  }
}, [location.state, LOAN_PRODUCTS]);

  
 useEffect(() => {
  setLoading(true)
  const fetchLoans = async () => {
    const res = await fetch('http://localhost:5000/loans')
    if (!res.ok) throw { message: 'Error fetching loans' }
    const data = await res.json()
    setLOAN_PRODUCTS(data)
  }
  fetchLoans()
 }, [])
  
  function chooseIcon(loan) {
    if (loan.name === 'Personal Loan') {
     return <MoneyIcon/>
    } else if (loan.name === 'Education Loan') {
      return <GraduationIcon/>
    } else {
      return <CarIcon/>
    }
  }


    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            
            {/* Hero Section */}
            <header className="bg-gray-900 text-white py-16 px-6 sm:px-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                        Find the Right Loan for You
                    </h1>
                    <p className="text-xl text-gray-300">
                        Competitive rates and flexible terms from WindForest Bank to help you achieve your goals.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Column 1 & 2: Loan Products */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-3xl font-bold text-gray-800 border-b border-red-600 pb-3">Loan Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {LOAN_PRODUCTS.map((loan) => (
                              <LoanProductCard 
  icon={chooseIcon(loan)}
  key={loan.name} 
  loan={loan} 
  onSelect={(l) => setSelectedLoan(l)}
/>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Loan Calculator */}
                    <aside className="lg:col-span-1">
                        <h2 className="text-3xl font-bold text-gray-800 border-b border-red-600 pb-3 mb-8 hidden lg:block">Calculator</h2>
                        <LoanCalculator selectedLoan={selectedLoan} setIsOpen={setIsOpen} setConfirm={setConfirm}/>

                    </aside>
                </div>
            </main>

            {/* Footer CTA */}
             <div className="bg-gray-800 text-white py-12 mt-12">
                <div className="max-w-7xl mx-auto text-center px-6">
                    <h3 className="text-3xl font-bold mb-3">Ready to Apply?</h3>
                    <p className="text-gray-300 mb-6">Start your quick, secure online application today.</p>
                    <Link to='/account-types' className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-xl hover:bg-red-700 transition-colors">
                        Get Started
                    </Link>
                </div>
            </div>
            <LoginRequiredCard setIsOpen={setIsOpen} isOpen={isOpen} />
            <LoanSubmittedCard confirm={confirm} setConfirm={setConfirm} selectedLoan={selectedLoan} />
        </div>
    );
};

export default LoanProductsPage;
