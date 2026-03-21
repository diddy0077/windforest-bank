import React,{useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";


const LockClosedIcon = ({ colorClass = "text-red-700" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-12 h-12 ${colorClass}`}
  >
    <path
      fillRule="evenodd"
      d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const UserGroupIcon = ({ colorClass = "text-red-700" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-12 h-12 ${colorClass}`}
  >
    <path d="M6.25 6.375a4.125 4.125 0 1 1-8.25 0 4.125 4.125 0 0 1 8.25 0ZM3.5 19.125a7.125 7.125 0 0 0 7.25-7.125c0-3.96-3.195-7.125-7.125-7.125Z" />
  </svg>
);

const ChartPieIcon = ({ colorClass = "text-red-700" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-12 h-12 ${colorClass}`}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16.09c-3.14-.5-5.59-3.21-5.59-6.59s2.45-6.09 5.59-6.59V18.09zM13 18.09V5.91c2.61.42 4.79 2.53 5.4 5.24L13 18.09z" />
  </svg>
);

const BanknotesIcon = ({ colorClass = "text-red-700" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-12 h-12 ${colorClass}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 7.5l-2.43 5.09-4.82-2.73m11.832 2.73-2.43 5.09-4.82-2.73M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 15a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75V8.25a.75.75 0 0 1 .75-.75h14.998a.75.75 0 0 1 .75.75v6.75Z"
    />
  </svg>
);

const SparklesIcon = ({ colorClass = "text-red-700" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-12 h-12 ${colorClass}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21.35c.162.083.33.158.5.228M12 2.65c-.162-.083-.33-.158-.5-.228m-.284 18.572a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21.35c.162.083.33.158.5.228M12 2.65c-.162-.083-.33-.158-.5-.228m-.284 18.572a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4Z"
    />
  </svg>
);

const BriefcaseIcon = ({ colorClass = "text-red-700" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-12 h-12 ${colorClass}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-.75.75h-9a.75.75 0 0 1-.75-.75v-5.25a.75.75 0 0 1 .75-.75h9Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7.5v-3a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v3H3v-3a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v3h9Z"
    />
  </svg>
);

const ChevronDownIcon = ({ isOpen, colorClass = "text-gray-600" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-6 h-6 transform transition-transform ${
      isOpen ? "rotate-180" : ""
    } ${colorClass}`}
  >
    <path
      fillRule="evenodd"
      d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Framer Motion Variants ---
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const testimonials = [
  {
    quote:
      "Switching to this bank was the best financial decision I've made. The app is intuitive, and the customer service is unmatched.",
    author: "Sarah J.",
    title: "Small Business Owner",
  },
  {
    quote:
      "Finally, a banking experience built for the modern world. The security features give me complete peace of mind.",
    author: "Michael T.",
    title: "Freelance Designer",
  },
  {
    quote:
      "The budgeting tools are a game-changer. I've never had such a clear picture of my finances before.",
    author: "Jessica R.",
    title: "Student",
  },
];

const faqs = [
  {
    question: "Is my money safe with you?",
    answer:
      "Yes, your deposits are insured up to $250,000 through our partnership with FDIC-member banks. We use state-of-the-art encryption and fraud prevention to protect your account.",
  },
  {
    question: "How do I open a new account?",
    answer:
      "You can open an account in just a few minutes directly from our mobile app or website. You'll need to provide some basic personal information and a government-issued ID.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No, we believe in complete transparency. We have no hidden fees for our standard checking accounts. Our pricing is straightforward and easy to understand.",
  },
  {
    question: "Can I use my account for international transactions?",
    answer:
      "Yes, our accounts support global transfers with competitive exchange rates and minimal fees. We've partnered with a global network to ensure your money gets where it needs to go, quickly and affordably.",
  },
];

const accountTypes = [
  {
    icon: <BanknotesIcon colorClass="text-red-700" />,
    title: "Checking Account",
    description:
      "Everyday banking with no monthly fees, instant transfers, and a debit card.",
    cta: "Open Now",
  },
  {
    icon: <SparklesIcon colorClass="text-red-700" />,
    title: "High-Yield Savings",
    description:
      "Grow your money with a competitive interest rate and automated savings tools.",
    cta: "Start Saving",
  },
  {
    icon: <BriefcaseIcon colorClass="text-red-700" />,
    title: "Business Account",
    description:
      "Simplify your business finances with invoicing, expense tracking, and more.",
    cta: "Get Started",
  },
];

// --- Main Component ---
const HomePage = () => {
  const [openFAQ, setOpenFAQ] = React.useState(null);
  const [showBalance, setShowBalance] = useState(true);
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.title = "WindForest Capital | Online Banking & Financial Services";
   }, []);
   const nav = useNavigate()
  
  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 min-h-screen font-sans">
      {/* --- Modern Banking Hero Section --- */}
      <Header />
      
      {/* Hero Section with Gradient Background */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-[85vh] overflow-hidden mt-12">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-red-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-red-600/20 to-amber-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-500/10 to-amber-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 pt-8 pb-12">
          {/* Welcome Message */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-slate-400 text-lg mb-1">Welcome back,</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">John Anderson</h1>
          </motion.div>

          {/* Account Balance Card */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-2xl max-w-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Total Balance</p>
                  <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    {showBalance ? '$47,892.45' : '••••••••'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="w-10 h-10 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl flex items-center justify-center transition-colors"
                    title={showBalance ? 'Hide balance' : 'Show balance'}
                  >
                    {showBalance ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  +2.4% this month
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Action Buttons */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Transfer', color: 'from-amber-400 to-orange-500' },
              { icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z', label: 'Pay Bills', color: 'from-red-500 to-rose-600' },
              { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Statements', color: 'from-blue-500 to-indigo-600' },
              { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', label: 'Cards', color: 'from-emerald-400 to-teal-500' },
            ].map((action) => (
              <motion.button
                key={action.label}
                className="bg-slate-800/60 backdrop-blur-sm hover:bg-slate-700/80 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                  </svg>
                </div>
                <span className="text-white text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Account Cards Row */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Checking Account */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-slate-400 text-xs">**** 4521</span>
              </div>
              <p className="text-slate-400 text-xs mb-1">Checking Account</p>
              <p className="text-xl font-bold text-white">$12,450.00</p>
            </div>

            {/* Savings Account */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-slate-400 text-xs">**** 7832</span>
              </div>
              <p className="text-slate-400 text-xs mb-1">Savings Account</p>
              <p className="text-xl font-bold text-white">$28,942.45</p>
            </div>

            {/* Investment Account */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-slate-400 text-xs">**** 2156</span>
              </div>
              <p className="text-slate-400 text-xs mb-1">Investment</p>
              <p className="text-xl font-bold text-white">$6,500.00</p>
            </div>
          </motion.div>

          {/* Recent Transactions Preview */}
          <motion.div 
            className="mt-8 bg-slate-800/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
              <button className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">View All</button>
            </div>
            <div className="space-y-3">
              {[
                { merchant: 'Amazon.com', date: 'Today, 2:34 PM', amount: '-$156.99', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', type: 'debit' },
                { merchant: 'Payroll Deposit', date: 'Today, 9:00 AM', amount: '+$3,250.00', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', type: 'credit' },
                { merchant: 'Netflix', date: 'Yesterday', amount: '-$15.99', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', type: 'debit' },
                { merchant: 'Electric Company', date: 'Mar 10', amount: '-$142.50', icon: 'M13 10V3L4 14h7v7l9-11h-7z', type: 'debit' },
              ].map((tx, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-500/20' : 'bg-slate-700/50'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${tx.type === 'credit' ? 'text-green-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={tx.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{tx.merchant}</p>
                      <p className="text-slate-400 text-xs">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold text-sm ${tx.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Mobile Banking Section --- */}
      <section className="py-20 bg-gray-900 text-gray-200">
  <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
    <div className="w-full md:w-1/2 flex justify-center">
      <div className="relative w-full max-w-xs h-[550px] md:h-[600px] bg-gray-900 rounded-[4rem] p-2 shadow-[0_20px_40px_rgba(0,0,0,0.3)] transform transition-transform duration-500 hover:scale-105">
        {/* Phone Frame */}
        <div className="absolute inset-0 border-[8px] border-black rounded-[4rem] pointer-events-none z-10"></div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20"></div>
        {/* App Screen Content */}
        <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1726065235203-4368c41c6f19?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Mobile banking app screen"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"></div>
          {/* Fargo logo and text overlay */}
          <div className="absolute top-0 w-full p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold">WindForest</div>
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm">9:41 AM</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          {/* Spending Insights Section */}
          <div className="absolute bottom-0 w-full p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">
              Here's insights into your spending
            </h3>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
                    {/* Placeholder for spending chart */}
                    <div className="w-20 h-20 bg-red-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-300 mt-2">
                    March 1 - Mar 31, 2024
                  </p>
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1 ml-6 text-sm">
                  <p className="text-gray-300">Total Spending</p>
                  <p className="font-bold text-lg text-white">
                    $1,725.34
                  </p>
                  <p className="text-gray-300">-$1,100.66 from Feb</p>
                </div>
              </div>
            </div>
            <div className="flex justify-around text-sm font-medium">
              <button className="text-red-400 border-b-2 border-red-400 pb-1">
                Summary
              </button>
              <button className="text-white hover:text-red-400">
                Category
              </button>
              <button className="text-white hover:text-red-400">
                Merchant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      className="w-full md:w-1/2 text-center md:text-left"
      initial="hidden"
      whileInView="visible"
      variants={sectionVariants}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Powerful Mobile Banking, At Your Fingertips.
      </h2>
      <p className="text-lg mb-6">
        Our mobile app, featuring **WindForest**, gives you valuable insights like a
        **summary of your spending by category** and retailer, across all your
        accounts. Manage your money anytime, anywhere.
      </p>
      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        <img
          src="https://placehold.co/150x50/000000/ffffff?text=Download+on+the+App+Store"
          alt="Download on the App Store"
          className="h-12 cursor-pointer"
        />
        <img
          src="https://placehold.co/150x50/000000/ffffff?text=Get+it+on+Google+Play"
          alt="Get it on Google Play"
          className="h-12 cursor-pointer"
        />
      </div>
    </div>
  </div>
</section>

      ---

      {/* --- New Section with a Baking Image (Optional) --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="w-full md:w-1/2"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1607863680198-23d4b2565df0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Person baking bread"
              className="rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            onClick={() => nav('/account-types')} 
            >
              
              Start a New Chapter.
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Whether you're starting a new business or a new hobby like baking,
              we're here to support your journey with the right financial tools.
            </p>
            <button className="px-8 py-3 bg-red-700 text-white font-semibold rounded-full shadow-lg hover:bg-red-800 transition-colors">
              
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      ---

      {/* --- Trust Indicators Section --- */}
      <motion.section
        className="py-12 bg-white border-b border-gray-200"
        initial="hidden"
        whileInView="visible"
        variants={fadeIn}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-8">
            Your money is safe with us. We're a member of FDIC and partners with
            industry leaders.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-80">
            <img
              src="https://placehold.co/120x40/f3f4f6/4b5563?text=VISA"
              alt="VISA"
              className="h-8 md:h-10"
            />
            <img
              src="https://placehold.co/120x40/f3f4f6/4b5563?text=MASTERCARD"
              alt="MasterCard"
              className="h-8 md:h-10"
            />
            <img
              src="https://placehold.co/120x40/f3f4f6/4b5563?text=FDIC"
              alt="FDIC Insured"
              className="h-8 md:h-10"
            />
            <img
              src="https://placehold.co/120x40/f3f4f6/4b5563?text=Plaid"
              alt="Plaid"
              className="h-8 md:h-10"
            />
          </div>
        </div>
      </motion.section>

      ---

      {/* --- Key Features / Services --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powerful Features, Made Simple.
            </h2>
            <p className="text-lg text-slate-600">
              We've built a banking platform with all the tools you need, without the
              complexity.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center transform hover:scale-102 transition-transform duration-300 group"
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-red-500/25 transition-shadow">
                <LockClosedIcon colorClass="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2">
                Advanced Security
              </h3>
              <p className="text-slate-600">
                Your data and funds are protected by bank-level encryption and
                biometric authentication.
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center transform hover:scale-102 transition-transform duration-300 group"
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-amber-500/25 transition-shadow">
                <UserGroupIcon colorClass="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2">
                Instant Transfers
              </h3>
              <p className="text-slate-600">
                Send and receive money instantly with friends and family, with zero
                fees.
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center transform hover:scale-102 transition-transform duration-300 group"
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow">
                <ChartPieIcon colorClass="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2">
                Smart Budgeting
              </h3>
              <p className="text-slate-600">
                Use our intuitive tools to track spending and automatically save
                for your goals.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      ---

      {/* --- Explore Our Accounts Section --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Our Accounts
            </h2>
            <p className="text-lg text-gray-700">
              We have an account for every financial need. Find the perfect fit for
              you.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true, amount: 0.4 }}
          >
            {accountTypes.map((account, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100 text-center transform hover:scale-102 transition-transform duration-300"
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                }}
              >
                <div className="mb-4 flex justify-center">{account.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {account.title}
                </h3>
                <p className="text-gray-600">{account.description}</p>
                <motion.a
                  href="/accounts"
                  className="mt-6 inline-block px-6 py-2 bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {account.cta}
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      ---

      {/* --- How It Works Section --- */}
     <section className="py-20 bg-white overflow-hidden">
  <div className="container mx-auto px-6 text-center">
    {/* Headline Section - Updated Colors */}
    <motion.div
      className="max-w-3xl mx-auto mb-16"
      initial="hidden"
      whileInView="visible"
      variants={sectionVariants}
      viewport={{ once: true }}
    >
      <h2 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        Our Simple Process
      </h2>
      <p className="text-xl text-gray-500 font-light">
        Banking made effortless in just a few steps.
      </p>
    </motion.div>

    {/* Steps Container */}
    <div className="relative flex flex-col md:flex-row justify-center items-stretch gap-12">
      
      {/* 🌟 BEAUTIFUL CONNECTING LINE (Visible on MD and up) 🌟 */}
      {/* This uses a subtle shadow and a dashed border for a sophisticated look */}
      <div 
        className="hidden md:block absolute top-1/2 left-[20%] right-[20%] -translate-y-1/2"
      >
        <div 
          className="h-1 border-b-2 border-dashed border-red-300 w-full" 
          style={{ 
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)', // Soft, matching shadow
          }}
        ></div>
      </div>
      
      {/* Step 1: Sign Up in Minutes */}
      <motion.div
        className="w-full md:w-1/3 p-8 text-center bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out border border-gray-100 relative z-10"
        variants={itemVariants}
      >
        {/* Step Marker: Vibrant Ring with Icon/Number */}
        <div className="w-16 h-16 rounded-full bg-red-600 ring-4 ring-red-200 mx-auto mb-6 flex items-center justify-center text-white text-3xl font-extrabold shadow-md transform hover:scale-105 transition duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 18h.01" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Sign Up in Minutes
        </h3>
        <p className="text-gray-500">
          Provide a few details to get started. No long forms or waiting in line.
        </p>
      </motion.div>

      {/* Step 2: Get Your Card */}
      <motion.div
        className="w-full md:w-1/3 p-8 text-center bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out border border-gray-100 relative z-10"
        variants={itemVariants}
      >
        {/* Step Marker: Vibrant Ring with Icon/Number */}
        <div className="w-16 h-16 rounded-full bg-red-600 ring-4 ring-red-200 mx-auto mb-6 flex items-center justify-center text-white text-3xl font-extrabold shadow-md transform hover:scale-105 transition duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Get Your Card
        </h3>
        <p className="text-gray-500">
          Your new debit card arrives in days, or use our digital card immediately.
        </p>
      </motion.div>
      
    </div>
  </div>
</section>

      ---

      {/* --- Testimonials Section --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-700">
              Don't just take our word for it. Hear from real people who trust us
              with their finances.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100"
                variants={itemVariants}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-2 text-red-500 mb-4">
                  {/* --- Star Icons --- */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.784-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.784-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.784-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.784-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.784-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-xl italic text-gray-800 mb-4">
                  "{testimonial.quote}"
                </p>
                <p className="font-semibold text-gray-900">
                  - {testimonial.author}
                </p>
                <p className="text-gray-500 text-sm">{testimonial.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      ---

      {/* --- FAQ Section --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-700">
              Find answers to the most common questions about our services.
            </p>
          </motion.div>
          <div>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md mb-4 cursor-pointer border border-gray-100"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {faq.question}
                  </h3>
                  <ChevronDownIcon isOpen={openFAQ === index} />
                </div>
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      ---

      {/* --- Call to Action Section --- */}
      <section className="bg-red-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Us?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Open an account in minutes and start your journey towards financial
              wellness today.
            </p>
            <Link to="/account-types" className="px-10 py-4 bg-white text-red-700 font-bold rounded-full shadow-lg hover:bg-gray-200 transition-colors">
              Open an Account
            </Link>
          </motion.div>
        </div>
      </section>

      ---

      {/* --- Footer --- */}
      
    </div>
  );
};

export default HomePage;