import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';



const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const BookOpenIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 19.5c0 .77.55 1.5 1.3 1.5h17.4c.75 0 1.3-.73 1.3-1.5-.7-.34-1.35-.98-1.77-1.74-.42-.76-.64-1.63-.64-2.5 0-1.84 1.4-3.34 3.1-3.5H22"/>
    <path d="M12 2c3.5 0 6.5 1.5 8 4h-4c-1.5-2.5-4.5-4-8-4z"/>
    <path d="M10 2c-3.5 0-6.5 1.5-8 4h4c1.5-2.5 4.5-4 8-4z"/>
    <path d="M12 22c3.5 0 6.5-1.5 8-4h-4c-1.5 2.5-4.5 4-8 4z"/>
  </svg>
);

const CreditCardIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const ShieldIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const MessageCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// Mock data for categories
export const categories = [
  { 
    title: "Accounts & Services", 
    description: "Questions about checking, savings, direct deposit, and statements.", 
    Icon: CreditCardIcon, 
    slug: "accounts",
    content: `
      <section class="mb-10 pt-4">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">Checking Accounts</h3>
        <p class="text-gray-700 leading-relaxed mb-4">Our core checking accounts are designed for everyday financial freedom. Enjoy features like **free online banking**, unlimited debit card transactions, and no minimum balance requirement. We also offer specialized accounts for students and seniors.</p>
        <ul class="list-disc list-outside ml-6 text-gray-600 space-y-2">
            <li>No monthly maintenance fees.</li>
            <li>Overdraft protection options available.</li>
            <li>Free personalized checks (for select accounts).</li>
        </ul>
      </section>
      
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">High-Yield Savings Accounts</h3>
        <p class="text-gray-700 leading-relaxed mb-4">Build your future with our competitive savings accounts. We offer high-yield rates with minimal restrictions, making it easy for you to grow your wealth over time. Easily transfer funds between your Wind Forest Bank accounts instantly.</p>
      </section>

      <section class="mb-6">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">Direct Deposit & Statements</h3>
        <p class="text-gray-700 leading-relaxed mb-4">Setting up direct deposit is the fastest way to access your paycheck. Provide your employer with your **account and routing numbers** to get started. You can manage your e-Statements and paper statement preferences directly in your online banking portal.</p>
        <div class="mt-4 p-4 bg-gray-100 border-l-4 border-red-600 text-gray-800 rounded-md shadow-sm">
          <strong class="font-bold">Quick Tip:</strong> Find your routing number and direct deposit form under the 'Account Details' tab in your mobile app.
        </div>
      </section>
    `
  },
  { 
    title: "Loans & Mortgages", 
    description: "Information on applying, payments, rates, and refinancing options.", 
    Icon: ({className}) => <BookOpenIcon className={className + " transform rotate-180"}/>, 
    slug: "loans",
    content: `
      <section class="mb-10 pt-4">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">Applying for Personal Loans</h3>
        <p class="text-gray-700 leading-relaxed mb-4">Whether you're consolidating debt or funding a major purchase, our personal loans offer flexible terms and competitive, fixed interest rates. The application process is fast, and you can often receive a decision within one business day.</p>
        <ul class="list-disc list-outside ml-6 text-gray-600 space-y-2">
            <li>Quick online application process.</li>
            <li>Terms ranging from 12 to 60 months.</li>
            <li>Use the loan calculator on our main site for estimates.</li>
        </ul>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">Mortgage Products & Refinancing</h3>
        <p class="text-gray-700 leading-relaxed mb-4">We guide you through the entire home-buying journey, from pre-approval to closing. We offer conventional, FHA, and VA loan options. If you're looking to lower your current payment or tap into home equity, explore our <a href="/refinancing" class="text-red-600 hover:text-red-700 font-semibold">refinancing options</a>.</p>
        <div class="mt-4 p-4 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-md shadow-sm">
            <strong class="font-bold">Next Step:</strong> Schedule a free consultation with one of our mortgage advisors today.
        </div>
      </section>

      <section class="mb-6">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">Managing Payments and Rates</h3>
        <p class="text-gray-700 leading-relaxed">Loan payments can be managed easily through our online portal. Set up **automatic recurring payments** to ensure you never miss a due date. For the most up-to-date information on current interest rates for all our loan products, please visit our dedicated Rates page.</p>
      </section>
    `
  },
  { 
    title: "Security & Fraud", 
    description: "Protecting your information, reporting suspicious activity, and privacy.", 
    Icon: ShieldIcon, 
    slug: "security",
    content: `
      <section class="mb-10 pt-4">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">Account Security</h3>
        <p class="text-gray-700 leading-relaxed mb-4">Your first line of defense is a strong, unique password. We recommend using a mix of letters, numbers, and symbols. Additionally, always enable **two-factor authentication (2FA)** whenever possible. 2FA adds an extra layer of security by requiring a second verification step, usually through a code sent to your mobile device.</p>
        <ul class="list-disc list-outside ml-6 text-gray-600 space-y-2">
            <li>Change your password every 90 days.</li>
            <li>Never share your login credentials with anyone.</li>
            <li>Monitor your account activity regularly.</li>
        </ul>
      </section>
      
      <section class="mb-10">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">Fraud Protection</h3>
        <p class="text-gray-700 leading-relaxed mb-4">Be vigilant against phishing scams, which often arrive via email or text message requesting urgent account verification or login details. Wind Forest Bank will **never** ask for your password or PIN via email or unsolicited calls. If you receive a suspicious communication, do not click any links or download attachments. Report it immediately.</p>
        <div class="mt-4 p-4 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-md shadow-sm">
            <strong class="font-bold">Urgent Action:</strong> To report suspected fraud on your account, please call us directly at <a href="tel:1-800-555-9325" class="underline hover:text-red-900">1-800-555-WFBK</a>.
        </div>
      </section>

      <section class="mb-6">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">Privacy Policy</h3>
        <p class="text-gray-700 leading-relaxed">We are deeply committed to protecting your privacy. Our comprehensive privacy policy outlines exactly how we collect, use, and protect your personal and financial information. You always have control over your data; review your privacy settings in your online banking portal or visit our <a href="/privacy-policy" class="text-red-600 hover:text-red-700 font-semibold">full policy page</a>.</p>
      </section>
    `
  },
  { 
    title: "Digital Banking", 
    description: "Help with the mobile app, online bill pay, and password resets.", 
    Icon: BookOpenIcon, 
    slug: "digital",
    content: `
      <section class="mb-10 pt-4">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">Mobile App & Features</h3>
        <p class="text-gray-700 leading-relaxed mb-4">Our award-winning mobile app provides you with 24/7 access to your finances. Use it to check balances, transfer funds, pay bills, and even **deposit checks remotely** using your phone's camera.</p>
        <ul class="list-disc list-outside ml-6 text-gray-600 space-y-2">
            <li>Fingerprint or Face ID login support.</li>
            <li>Instant transaction alerts.</li>
            <li>Find nearby ATM/branch locations.</li>
        </ul>
      </section>

      <section class="mb-10">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">Online Bill Pay & Transfers</h3>
        <p class="text-gray-700 leading-relaxed mb-4">Stop mailing checks! Use Online Bill Pay to manage all your creditors from one secure dashboard. You can schedule payments in advance and set up recurring payments for utilities or rent. Transfers between your internal accounts are always free and instant.</p>
      </section>

      <section class="mb-6">
        <h3 class="text-2xl font-bold text-gray-900 mb-3 border-b border-red-100 pb-2">Password and Access Resets</h3>
        <p class="text-gray-700 leading-relaxed">If you've forgotten your password, click the **"Forgot Password"** link on the login screen. You will be guided through a secure two-step verification process to reset your credentials. For security reasons, if your account is locked, please contact support for immediate assistance.</p>
      </section>
    `
  }
];


/**
 * Category Card Component
 */
export const CategoryCard = ({ title, description, Icon }) => (
  <div 
    className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-200 transform hover:scale-[1.02] hover:border-red-600/50"
  >
    <div className="flex items-start">
      <div className="flex-shrink-0 p-3 rounded-full bg-red-100 text-red-600">
        {Icon ? <Icon className="w-6 h-6" /> : null}
       </div>
      <div className="ml-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);


/**
 * Main Help Center Page Component
 */
const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const filteredCategories = categories.filter(c =>
  c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  
  const nav = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    nav(`/help/search?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    // Light Theme Background
    <div className="min-h-screen bg-gray-50 font-inter p-4 sm:p-8">
      
      {/* Header Section */}
      <header className="max-w-4xl mx-auto py-6 mb-8 text-center">
        <div className="flex items-center justify-center text-red-600 mb-2">
            <BookOpenIcon className="w-10 h-10 mr-3" />
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Wind Forest Help Center
            </h1>
        </div>
        <p className="mt-2 text-xl text-gray-600">
            Search our knowledge base or browse topics below.
        </p>
      </header>
      
      {/* Search Bar (Prominent and Central) */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            
            <input
              type="search"
              placeholder="E.g., 'How do I reset my password?' or 'Check deposit limit'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-5 py-4 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-lg text-gray-800 transition duration-150"
            />
            
            {/* Search Button (Red-600) */}
            <button
              type="submit"
              className="flex items-center justify-center sm:w-auto w-full px-6 py-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area: Categories and Contact */}
      <main className="max-w-5xl mx-auto">
        
        {/* Quick Topics Grid */}
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2 border-red-100">
                Popular Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCategories.map((category, index) => (
                  <Link to={`/help/${category.slug}`}>
                    <CategoryCard key={index} {...category} />
                  </Link>
                ))}
            </div>
        </section>

        {/* Contact Support Section */}
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2 border-red-100">
                Still Need Help?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Contact Card 1: Live Chat (Red Primary) */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-600 transition duration-200 hover:shadow-lg">
                    <div className="text-red-600 mb-3"><MessageCircleIcon className="w-8 h-8"/></div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
                    <p className="text-gray-600 text-sm mb-4">Chat instantly with a support specialist during business hours.</p>
                    <Link to="#chat" className="text-red-600 font-semibold hover:text-red-700 transition duration-150">
                        Start a Chat &rarr;
                    </Link>
                </div>

                {/* Contact Card 2: Phone Support (Gray/White) */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-gray-400 transition duration-200 hover:shadow-lg">
                    <div className="text-gray-600 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-gray-600 text-sm mb-4">Speak directly with a representative at 1-800-555-WFBK.</p>
                    <Link to="tel:1-800-555-9325" className="text-gray-600 font-semibold hover:text-gray-700 transition duration-150">
                        (800) 555-WFBK &rarr;
                    </Link>
                </div>

                {/* Contact Card 3: Branch Visit (Gray/White) */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-gray-400 transition duration-200 hover:shadow-lg">
                    <div className="text-gray-600 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Visit a Branch</h3>
                    <p className="text-gray-600 text-sm mb-4">Get face-to-face assistance at any Wind Forest Bank location.</p>
                    <Link to="/atm-locations" className="text-red-600 font-semibold hover:text-red-700 transition duration-150">
                        Find a Location &rarr;
                    </Link>
                </div>

            </div>
        </section>

      </main>
      
    </div>
  );
};

export default Help;
