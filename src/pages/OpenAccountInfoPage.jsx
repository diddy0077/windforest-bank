import React,{useEffect} from 'react';
import { Link } from 'react-router-dom';

// Mock Icons using inline SVG
const LockIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z"></path>
    </svg>
);
const TimeIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);
const MobileIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
    </svg>
);
const CheckIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);
const DocumentIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
);

// Component for a single benefit card
const BenefitCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-red-600 transition-transform hover:scale-[1.02]">
        <div className="text-red-600 mb-4">{Icon && <Icon />}</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

// Component for a single step in the process
const ProcessStep = ({ number, title, description, isLast }) => (
    <div className={`relative flex items-start ${isLast ? '' : 'pb-12'}`}>
        <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
            {!isLast && <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>}
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-600 text-white font-bold text-lg flex items-center justify-center relative z-10 shadow-lg border-2 border-white">
            {number}
        </div>
        <div className="ml-4 flex-grow pt-1">
            <h4 className="text-xl font-bold text-gray-800">{title}</h4>
            <p className="mt-1 text-gray-600">{description}</p>
        </div>
    </div>
);


const OpenAccountInfoPage = () => {

   useEffect(() => {
     window.scrollTo({ top: 0, behavior: "smooth" });
   }, []);

    return (
        <div className="min-h-screen bg-white font-sans antialiased">
            {/* Header / Hero Section */}
            <div className="bg-gray-900 text-white py-20 px-6 sm:px-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">
                        Open Your Account with WindForest Bank
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Your journey to smarter, more secure banking starts here. Simple setup, instant benefits.
                    </p>
                    <Link
                        to="/account-types"
                        className="mt-8 inline-block px-10 py-3 bg-red-600 text-white font-bold text-lg rounded-full shadow-2xl hover:bg-red-700 transition-colors transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-red-400"
                    >
                        Start Enrollment Now
                    </Link>
                </div>
            </div>

            {/* Section 1: Core Benefits */}
            <section className="py-16 px-6 sm:px-10 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose WindForest?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <BenefitCard
                            icon={LockIcon}
                            title="Ironclad Security"
                            description="Protect your assets with industry-leading encryption and 24/7 fraud monitoring. Security is our priority."
                        />
                        <BenefitCard
                            icon={TimeIcon}
                            title="Effortless Speed"
                            description="Open an account in under 10 minutes. Our digital process is fast, paperless, and incredibly simple."
                        />
                        <BenefitCard
                            icon={MobileIcon}
                            title="Mobile-First Banking"
                            description="Manage all your finances on the go with our top-rated, intuitive mobile application."
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: Account Opening Process */}
            <section className="py-16 px-6 sm:px-10 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Simple 3-Step Process</h2>
                    
                    <div className="relative">
                        <ProcessStep
                            number={1}
                            title="Quick Online Application"
                            description="Fill out our secure, concise digital form. We only ask for the essentials to verify your identity."
                        />
                        <ProcessStep
                            number={2}
                            title="Secure Verification"
                            description="We instantly verify your information, or if necessary, use micro-deposits to confirm external accounts."
                        />
                        <ProcessStep
                            number={3}
                            title="Welcome to WindForest"
                            description="Your account is active immediately. Fund your account and start banking confidently!"
                            isLast={true}
                        />
                    </div>
                </div>
            </section>

            {/* Section 3: Requirements and Documents (Grid) */}
            <section className="py-16 px-6 sm:px-10 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What You Will Need</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        {['Photo ID (Driver\'s License or Passport)', 'Social Security Number (SSN)', 'Current Home Address', 'Email & Mobile Phone'].map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <div className="text-red-600 mx-auto mb-3">
                                    <DocumentIcon />
                                </div>
                                <p className="font-semibold text-gray-700">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <div className="bg-red-600 text-white py-12 px-6 sm:px-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-3">Ready to Start?</h2>
                    <p className="text-lg mb-6">Opening an account is fast, free, and fully secure.</p>
                    <Link
                        to="/account-types"
                        className="inline-block px-10 py-3 bg-white text-red-600 font-bold text-lg rounded-full shadow-2xl hover:bg-gray-100 transition-colors transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-white"
                    >
                        Open Account Today &gt;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OpenAccountInfoPage;
