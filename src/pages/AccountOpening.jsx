import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";

const AccountOpening = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [account, setAccount] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const params = useParams();
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [ssn, setSsn] = useState("");
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [employment, setEmployment] = useState('')
  const [income, setIncome] = useState('')
  const [employerName, setEmployerName] = useState('')
  const [initialDeposit, setInitialDeposit] = useState(0)
  const [debitCard, setDebitCard] = useState('')
  const [onlineBanking, setOnlineBanking] = useState('')
  const [fullNameError, setFullNameError] = useState("")
  const [dobError, setDobError] = useState("")
  const [ssnError, setSsnError] = useState("")
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [empStatusError, setEmpStatusError] = useState('')
  const [annualIcomError, setAnnaulIncomeError] = useState('')
  const [empNameError, setEmpNameError] = useState('')
  const [successMessage, setSuccessMessage] = useState("");
  const [generatedAccountNumber, setGeneratedAccountNumber] = useState("");
  const nav = useNavigate()

const downloadReceipt = () => {
  const doc = new jsPDF();

  const brandRed = "#D90429";
  const white = "#FFFFFF";

  // --- Red Sidebar ---
  doc.setFillColor(brandRed);
  doc.rect(0, 0, 20, 297, "F"); // full height sidebar

  // --- Header ---
  doc.setFillColor(brandRed);
  doc.rect(20, 0, 190, 30, "F"); // header rectangle
  doc.setTextColor(white);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("MyBank", 105, 20, { align: "center" });

  // --- Title ---
  doc.setTextColor(brandRed);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Account Opening Confirmation", 105, 45, { align: "center" });

  // Thin red line under title
  doc.setDrawColor(brandRed);
  doc.setLineWidth(0.5);
  doc.line(25, 50, 200, 50);

  // --- User Details Section ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  let y = 60; // starting y position
  const lineHeight = 10;

  const details = [
    `Full Name: ${fullName}`,
    `Account Type: ${account.name}`,
    `Account Number: ${generatedAccountNumber}`,
    `Initial Deposit: $${initialDeposit}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Address: ${address || "N/A"}`,
    `Employment Status: ${employment || "N/A"}`,
    `Annual Income: ${income || "N/A"}`
  ];

  details.forEach((line) => {
    doc.text(line, 30, y);
    y += lineHeight;
  });

  y += 10;

  // --- Thank You Section ---
  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandRed);
  doc.text(
    "Thank you for opening your account with us!",
    105,
    y,
    { align: "center" }
  );

  // Optional: small footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor("#666666");
  doc.text(
    "This is an auto-generated document. Keep it for your records.",
    105,
    285,
    { align: "center" }
  );

  // Save PDF
  doc.save(`Account_${generatedAccountNumber}.pdf`);
};

useEffect(() => {
   window.scrollTo({top: 0, behavior: 'smooth'})
  }, [])
  
  function generateAccountNumber(prefix = "10") {
  // Prefix + 10 random digits
  const randomPart = Math.floor(1000000000 + Math.random() * 9000000000);
  return prefix + randomPart.toString().slice(2);
}

  function validateDOB(dobInput) {
  // 1. Required
  if (!dobInput) {
    return "Date of birth is required.";
  }

  // 2. Must be a real date
  const dob = new Date(dobInput);
  if (isNaN(dob.getTime())) {
    return "Please enter a valid date.";
  }

  // 3. Must be at least 18 years old
  const today = new Date();
  const cutoff = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  if (dob > cutoff) {
    return "You must be at least 18 years old.";
  }

  // ✅ Passed all checks
  return "";
}


  useEffect(() => {
    setLoading(true);
    const fetchAccount = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/accountTypes/?name=${params.name}`
        );
        if (!res.ok) {
          throw {
            message: "Error fetching account",
            statusText: res.statusText,
            status: res.status,
          };
        }
        const data = await res.json();
        console.log(data);
        setAccount(data[0]);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching account", error);
        setError(error);
      }
    };
    fetchAccount();
  }, [params]);

  const steps = ["Personal", "Contact", "Employment", "Preferences", "Review"];

const handleNext = async () => {
  let isValid = true;

  if (currentStep === 0) {
    isValid = validateStep1();
  }
  if (currentStep === 1) {
    isValid = await validateStep2(); // ✅ await here
  }
  if (currentStep === 2) {
    isValid = validateStep3();
  }

  if (isValid) {
    setCurrentStep((prev) => prev + 1);
  }
};




  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  
  function validateEmail(email) {
  if (!email) {
    return "Email is required";
  }
  
    
  // Basic regex for email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Enter a valid email address";
  }

  return null; // ✅ means no error
}

function validateStep1() {
  let valid = true;

  setFullNameError("");
  setDobError("");
  setSsnError("");

  if (!fullName) {
    setFullNameError("Full name is required");
    valid = false;
  }

  const dobCheck = validateDOB(dob);
  if (dobCheck) {
    setDobError(dobCheck);
    valid = false;
  }

  if (!ssn) {
    setSsnError("SSN is required");
    valid = false;
  } else if (ssn.length < 11 || isNaN(ssn)) {
    setSsnError("Enter a valid SSN");
    valid = false;
  }

  return valid;
  }
  
const validateStep2 = async () => {
  let valid = true;

  setEmailError("");
  setPhoneError("");
  setAddressError("");

  const err = validateEmail(email);
  if (err) {
    setEmailError(err);
    valid = false;
  }

  // ✅ Check if email exists
  const res = await fetch('http://localhost:5000/users');
  const users = await res.json();
  const matchedUser = users.find((user) => user.email === email.trim().toLowerCase());

  if (matchedUser) {
    setEmailError('This email is already associated with an account. Please log in or reset your password!')
    toast.error("This email is already associated with an account. Please log in or reset your password!");
    return false; // ✅ explicitly return false
  }

  if (!address) {
    setAddressError("Enter a valid Address");
    valid = false;
  }

  if (!phone || phone.length < 10) {
    setPhoneError("Enter a valid Phone Number");
    valid = false;
  }

  return valid; // ✅ always return boolean
};


  function validateStep3() {
    let valid = true
    setEmpStatusError('')
    setAnnaulIncomeError('')
    setEmpNameError('') 
    if (!employerName) {
      setEmpNameError('Enter a valid Employer Name')
      valid = false;
      return
    }
    if (!setEmployment) {
      setEmpStatusError('Employment Status is required')
      valid = false
      return
    }
    if (!income) {
      setAnnaulIncomeError('Annual Income is required')
      valid = false;
      return;
    }
    return valid
  }

  function generateCard() {
    const cardTypes = ["Visa", "Mastercard"];
    const cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
  const cardNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const year = (new Date().getFullYear() + (3 + Math.floor(Math.random() * 3))).toString().slice(-2);
  const expiryDate = `${month}/${year}`;

  return {
    cardId: Date.now(),
    cardNumber,
    cardType,
    expiryDate,
    createdAt: new Date().toISOString()
  };
}


  const handleSubmit = async () => {
    if (!handleNext) return
   
    const accountNumber = generateAccountNumber("10"); 
  setGeneratedAccountNumber(accountNumber);
    
    try {
      const newAccount = {
    fullName,
    dob,
    ssn,
    email,
    phone,
    address,
    employment,
    income,
    employerName,
    initialDeposit,
    debitCard,
    onlineBanking,
    accountType: account.name,
        accountNumber,
        beneficiaries: [],
    notifications: [],
    accountBalance: initialDeposit || 0,
    card: [generateCard()]
  }
    const res = await fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newAccount)
    })
    if (!res.ok) {
      throw {
        message: 'Error Submitting Form',
      statusText: res.statusText,
      status: res.status
      }
    }
      const data = await res.json()
      console.log('Submitted', data)
      setSuccessMessage(
      `Account Successfully Created!\nAccount Type: ${account.name}\nAccount Number: ${accountNumber}\nInitial Deposit: $${initialDeposit}\nThank you for banking with us!`
    );
    }
    catch (error) {
      console.log('Error submitting form', error)
      setSuccessMessage("Something went wrong. Please try again.");

    }
  }

  function formatAccountNumber(num) {
  return num.match(/.{1,4}/g)?.join("-");
}

// Usage
const formattedAccountNumber = formatAccountNumber(generatedAccountNumber);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-15 h-15 border-5 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      {successMessage ? (
  <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-8 sm:p-10 text-center">
    <div className="mb-6">
      <svg
        className="mx-auto w-16 h-16 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-green-700 mb-4">Account Created!</h2>
    <p className="text-gray-700 mb-6">
      Your account has been successfully opened. Below are the details:
    </p>
    <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-left text-gray-800 space-y-2">
      <div>
        <span className="font-semibold">Full Name:</span> {fullName}
      </div>
      <div>
        <span className="font-semibold">Account Type:</span> {account.name}
      </div>
      <div>
        <span className="font-semibold">Account Number:</span>{" "}
        {formattedAccountNumber}
      </div>
      <div>
        <span className="font-semibold">Initial Deposit:</span> ${initialDeposit}
      </div>
      <div>
        <span className="font-semibold">Email:</span> {email}
      </div>
      <div>
        <span className="font-semibold">Phone:</span> {phone}
      </div>
    </div>
    <button
      onClick={() => (setSuccessMessage(""),nav('/online-enrollment'))}
      className="mt-6 mr-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
    >
      Enroll for Online Access
          </button>
          
          <button
  onClick={downloadReceipt}
  className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
>
  Download Receipt
</button>

  </div>
) : (
          <div>
            {!loading && account && (
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-6 sm:p-10">
          {/* Header */}
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Open a {account.name} Account
          </h1>
          <p className="text-sm sm:text-base text-gray-500 text-center mb-6">
            {account.description}
          </p>

          {/* Account Details Card */}
          <div className="mb-8 p-6 rounded-2xl bg-red-50 border border-red-200">
            <h2 className="text-lg font-semibold text-red-700 mb-3">
              Account Highlights
            </h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>
                <span className="font-medium">Interest Rate:</span>{" "}
                {`${account.interestRate}% APY`}
              </li>
              <li>
                <span className="font-medium">Minimum Balance:</span> $
                {account.minDeposit}
              </li>
              <li>
                <span className="font-medium">Fees:</span> ${account.monthlyFee}
              </li>
              <li>
                <span className="font-medium">Perks:</span>{" "}
                <div className="flex flex-col">
                  {account?.features?.map((a) => {
                    return (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                        <p>{a}</p>
                      </div>
                    );
                  })}
                </div>
              </li>
            </ul>
          </div>

          {/* Stepper with Progress Bar */}
          <div className="relative mb-8 sm:mb-12">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 transform -translate-y-1/2 rounded-full">
              <div
                className="h-full bg-red-600 transition-all duration-500 ease-in-out rounded-full"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-500 ease-in-out border-2 ${
                      index <= currentStep
                        ? "bg-red-600 border-red-600"
                        : "bg-white border-gray-400"
                    }`}
                  >
                    <span
                      className={`font-semibold text-lg sm:text-xl transition-colors duration-500 ${
                        index <= currentStep ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <div
                    className={`mt-2 text-xs sm:text-sm font-medium whitespace-nowrap text-center transition-colors duration-500 ${
                      index === currentStep
                        ? "text-red-700 font-bold"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Sections */}
          <form onSubmit={(e) => e.preventDefault()}  className="space-y-8">
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <h2 className="col-span-1 md:col-span-2 text-xl font-semibold text-red-600">
                  Personal Information
                </h2>
                <input
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                  type="text"
                  placeholder="Full Name"
                  className="border border-gray-300 rounded-xl p-4 w-full"
                />
                <input
                  onChange={(e) => setDob(e.target.value)}
                  value={dob}
                  type="date"
                  className="border border-gray-300 rounded-xl p-4 w-full"
                />
                <input
                  onChange={(e) => setSsn(e.target.value)}
                  value={ssn}
                  type="text"
                  placeholder="Social Security Number"
                  className="border border-gray-300 rounded-xl p-4 w-full"
                />
                <input
                  type="text"
                  value={account.name}
                  className="border border-gray-300 rounded-xl p-4 w-full bg-gray-50 text-gray-500 cursor-not-allowed"
                  disabled
                />
                {dobError && <p className="text-red-600 text-sm">{dobError}</p>}
                {fullNameError && <p className="text-red-600 text-sm">{fullNameError}</p>}
                {ssnError && <p className="text-red-600 text-sm">{ssnError}</p>}
              </div>
              
            )}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {" "}
                <h2 className="col-span-1 md:col-span-2 text-xl font-semibold text-red-600">
                  Contact Information
                </h2>{" "}
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email Address"
                  className="border border-gray-300 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                />{" "}
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  type="text"
                  placeholder="Phone Number"
                  className="border border-gray-300 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                />{" "}
                <textarea
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  placeholder="Residential Address"
                  className="border border-gray-300 rounded-xl p-4 w-full col-span-1 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  rows="3"
                ></textarea>{" "}
                {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}
                {addressError && <p className="text-red-600 text-sm">{addressError}</p>}
                {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
              </div>
            )}{" "}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {" "}
                <h2 className="col-span-1 md:col-span-2 text-xl font-semibold text-red-600">
                  Employment Information
                </h2>{" "}
                <select onChange={(e) => setEmployment(e.target.value)} value={employment} className="border border-gray-300 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
                  {" "}
                  <option value="">Employment Status</option>
<option value="employed">Employed</option>
<option value="self-employed">Self-Employed</option>
<option value="student">Student</option>
<option value="unemployed">Unemployed</option>
<option value="retired">Retired</option>
                </select>{" "}
                <input
                  type="text"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="Annual Income"
                  className="border border-gray-300 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                />{" "}
                <input
                  type="text"
                  onChange={(e) => setEmployerName(e.target.value)}
                  value={employerName}
                  placeholder="Employer Name"
                  className="border border-gray-300 rounded-xl p-4 w-full col-span-1 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                />{" "}
                {empStatusError && <p className="text-red-600 text-sm">{empStatusError}</p>}
                {annualIcomError && <p className="text-red-600 text-sm">{annualIcomError}</p>}
                {empNameError && <p className="text-red-600 text-sm">{empNameError}</p>}
              </div>
            )}{" "}
            {currentStep === 3 && (
              <div className="space-y-6">
                {" "}
                <h2 className="text-xl font-semibold text-red-600">
                  Account Preferences
                </h2>{" "}
                <div className="space-y-4">
                  {" "}
                  <input
                    onChange={(e) => setInitialDeposit(Number(e.target.value))}
                    value={initialDeposit}
                    type="text"
                    placeholder="Initial Deposit Amount"
                    className="border border-gray-300 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  />{" "}
                  <label className="flex items-center space-x-3 text-gray-700">
                    {" "}
                    <input
                      onChange={(e) => setDebitCard(e.target.checked)}
                      checked={debitCard}
                      type="checkbox"
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />{" "}
                    <span>Yes, I want a debit card.</span>{" "}
                  </label>{" "}
                  <label className="flex items-center space-x-3 text-gray-700">
                    {" "}
                    <input
                      onChange={(e) => setOnlineBanking(e.target.checked)}
                      checked={onlineBanking}
                      type="checkbox"
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />{" "}
                    <span>Yes, enroll me in online banking.</span>{" "}
                  </label>{" "}
                </div>{" "}
              </div>
            )}{" "}
            {currentStep === 4 && (
              <div className="space-y-4">
                {" "}
                <h2 className="text-xl font-semibold text-red-600">
                  Review Your Details
                </h2>{" "}
                <p className="text-gray-600">
                  {" "}
                  Please review your information carefully before submitting.
                  This section would display a summary of all entered data for
                  confirmation.{" "}
                </p>{" "}
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  {" "}
                  <ul className="space-y-2">
                    {" "}
                    <li className="text-gray-600">
                      {" "}
                      <span className="font-semibold text-gray-900">
                        Full Name:
                      </span>{" "}
                      {fullName}
                    </li>{" "}
                    <li className="text-gray-600">
                      {" "}
                      <span className="font-semibold text-gray-900">
                        Email:
                      </span>{" "}
                      {email}{" "}
                    </li>{" "}
                    <li className="text-gray-600">
                      {" "}
                      <span className="font-semibold text-gray-900">
                        Address:
                      </span>{" "}
                      {address}{" "}
                    </li>{" "}
                  </ul>{" "}
                </div>{" "}
              </div>
            )}
            {/* Buttons */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 border border-red-600 text-red-600 font-semibold rounded-full shadow-sm hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Back
              </button>
              {currentStep < steps.length - 1 ? (
                <button
                  type="submit"
                  onClick={handleNext}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                  <button
                    onClick={handleSubmit}
                  type="submit"
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition-colors"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      )}
  </div>
)}

      

      
    </div>
  );
};

export default AccountOpening;
