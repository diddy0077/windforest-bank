import React,{useEffect} from 'react';

// Terms of Service Content (Formatted for readability)
// In a real application, this would be fetched from a CMS or API.
const termsContent = [
  { 
    title: "1. Acceptance of Terms",
    color: "text-red-600",
    content: (
      <p>
        By accessing or using the services provided by **Wind Forest Bank** ("the Bank," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you do not have permission to access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
      </p>
    )
  },
  { 
    title: "2. Account Eligibility and Responsibilities",
    color: "text-red-600",
    content: (
      <>
        <p className="mb-4">
          To open an account with Wind Forest Bank, you must be at least 18 years old and capable of forming a binding contract.
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
          <li>You are responsible for maintaining the confidentiality of your account information, including your password.</li>
          <li>You agree to notify the Bank immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
          <li>All information you provide to the Bank must be accurate, complete, and current.</li>
        </ul>
      </>
    )
  },
  { 
    title: "3. Use of Service and Prohibitions",
    color: "text-red-600",
    content: (
      <>
        <p className="mb-4">
          The Service is provided for lawful banking and financial purposes only. You agree not to use the Service for any purpose that is prohibited by these Terms or applicable law. Prohibited activities include, but are not limited to:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
          <li>Engaging in any fraudulent or illegal activity.</li>
          <li>Attempting to interfere with the proper working of the Service.</li>
          <li>Harvesting or collecting information about other users without their consent.</li>
        </ul>
      </>
    )
  },
  { 
    title: "4. Fees and Charges",
    color: "text-red-600",
    content: (
      <p>
        You acknowledge that certain services provided by Wind Forest Bank may be subject to fees and charges. Details of all applicable fees are outlined in our separate Fee Schedule document, available on our website. Continued use of the Service constitutes your agreement to such fees.
      </p>
    )
  },
  { 
    title: "5. Termination",
    color: "text-red-600",
    content: (
      <p>
        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
      </p>
    )
  },
  { 
    title: "6. Governing Law",
    color: "text-red-600",
    content: (
      <p>
        These Terms shall be governed and construed in accordance with the laws of [Insert Governing Jurisdiction], without regard to its conflict of law provisions. Any legal action or proceeding arising out of or relating to these Terms will be instituted in the federal or state courts located in [Insert Governing City/County].
      </p>
    )
  },
  { 
    title: "7. Changes to Terms",
    color: "text-red-600",
    content: (
      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
      </p>
    )
  },
];


/**
 * Terms of Service Page for Wind Forest Bank
 * Styled with Brand Colors: Red-600 (Accents), White (Text), and various Grays (Backgrounds).
 */
const TermsOfService = () => {

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
  
  
  return (
    <div className="min-h-screen bg-gray-900 flex justify-center py-24 px-4 sm:px-6 lg:px-8">
      
      {/* Document Container */}
      <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">

        {/* Header */}
        <header className="text-center pb-8 border-b border-gray-700 mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Wind Forest Bank – Effective Date: October 25, 2023
          </p>
        </header>

        {/* Content Body */}
        <div className="space-y-10">
          <p className="text-gray-300 leading-relaxed">
            Welcome to Wind Forest Bank. Please read these Terms of Service carefully before using our services. These Terms govern your use of the website, mobile applications, and financial services provided by Wind Forest Bank.
          </p>

          {termsContent.map((section, index) => (
            <section key={index} className="space-y-4">
              <h2 className={`text-2xl font-bold ${section.color} border-b border-gray-600 pb-2`}>
                {section.title}
              </h2>
              <div className="text-gray-300 leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}

          {/* Contact Information Footer */}
          <footer className="pt-8 border-t border-gray-700 mt-10">
            <h3 className="text-xl font-semibold text-white mb-3">
              Contact Information
            </h3>
            <p className="text-gray-400">
              Questions about these Terms should be sent to us at:
            </p>
            <p className="text-gray-300 font-medium mt-1">
              Legal Department, Wind Forest Bank
              <br />
              <span className="text-red-400">support@windforestbank.com</span>
            </p>
          </footer>
        </div>

      </div>
    </div>
  );
};

export default TermsOfService;
