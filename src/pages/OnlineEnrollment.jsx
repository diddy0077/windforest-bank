import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const OnlineEnrollment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    ssn: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    securityQuestion: "",
    securityAnswer: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const [foundUser, setFoundUser] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isExisting, setIsExisting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const steps = [
    { title: "Personal Info", fields: ["fullName", "ssn", "dob"] },
    {
      title: "Account Creation",
      fields: ["username", "password", "securityQuestion", "securityAnswer"],
    },
    { title: "Terms & Conditions", fields: ["termsAccepted"] },
    { title: "Review & Submit", fields: [] },
  ];

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/users");
        if (!res.ok) {
          throw {
            message: "Error fetching users",
          };
        }
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching users", error);
        setError(error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) setError("");
  };

  const validateStep = () => {
    const currentStepFields = steps[currentStep].fields;
    const newErrors = {};
    let isValid = true;

    currentStepFields.forEach((field) => {
      if (typeof formData[field] === "string" && !formData[field].trim()) {
        newErrors[field] = "This field is required.";
        isValid = false;
      } else if (typeof formData[field] === "boolean" && !formData[field]) {
        newErrors[field] = "You must accept the terms and conditions.";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    setError("");
    if (!validateStep()) return;

    // Identity validation for first step
    if (currentStep === 0) {
      const matchedUser = users.find(
        (user) =>
          user.fullName.toLowerCase() === formData.fullName.toLowerCase() &&
          user.ssn === formData.ssn &&
          user.dob === formData.dob
      );
      setFoundUser(matchedUser);
      console.log(foundUser);
      if (!matchedUser) {
        setError(
          "The information provided does not match our records. Please check and try again."
        );
        console.log("Not Matched");
        return;
      } else {
        setError("");
      }
    }

    setCurrentStep((prevStep) => prevStep + 1);
  };

  useEffect(() => {
    if (foundUser) {
      console.log("Found user updated:", foundUser);
      setFormData((prev) => ({
        ...prev,
        email: foundUser.email || "",
        phone: foundUser.phone || "",
        address: foundUser.address || "",
        ssn: foundUser.ssn,
      }));
    }
  }, [foundUser]);

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true); // Disable the button and show a loading state
    try {
      const matchedUser = users.find(
        (user) =>
          user.fullName.toLowerCase().trim() ===
            formData.fullName.toLowerCase().trim() &&
          user.ssn === formData.ssn &&
          user.dob === formData.dob
      );

      if (!matchedUser) {
        setError("No matching user found.");
        setIsSubmitting(false);
        return;
      }
      const res = await fetch("http://localhost:5000/onlineAccessUsers");
      const onlineUsers = await res.json();

      // --- Start of Debugging Block ---
      console.log("Found matched user:", matchedUser);
      console.log("Fetching online access users...");
      // --- End of Debugging Block ---

      // --- Start of Debugging Block ---
      console.log("Fetched online access users:", onlineUsers);
      console.log("Searching for ID:", matchedUser.id);
      // --- End of Debugging Block ---

      const existingOnlineUser = onlineUsers.find(
        (access) => access.userId === matchedUser.id
      );

      // --- Start of Debugging Block ---
      console.log("Found existing online user:", existingOnlineUser);
      // --- End of Debugging Block ---

      if (existingOnlineUser) {
        setIsExisting(true);
        setError("This user already has an online access account.");
        // Stop processing and re-enable button
        return;
      }

      const onlineAccessData = {
        userId: matchedUser.id, // <-- dedicated link to user
        username: formData.username,
        password: formData.password,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
        termsAccepted: formData.termsAccepted,
      };

      const createRes = await fetch("http://localhost:5000/onlineAccessUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(onlineAccessData),
      });

      if (!createRes.ok)
        throw new Error("Failed to create online access account.");

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-red-600">
              Personal Information
            </h2>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? "border-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500 -mt-4">{errors.fullName}</p>
            )}
            <input
              type="text"
              name="ssn"
              placeholder="Social Security Number (SSN)"
              value={formData.ssn}
              onChange={handleChange}
              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.ssn
                  ? "border-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
            />
            {errors.ssn && (
              <p className="text-sm text-red-500 -mt-4">{errors.ssn}</p>
            )}
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.dob
                  ? "border-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
            />
            {errors.dob && (
              <p className="text-sm text-red-500 -mt-4">{errors.dob}</p>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-red-600">
              Account Creation
            </h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.username
                  ? "border-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
            />
            {errors.username && (
              <p className="text-sm text-red-500 -mt-4">{errors.username}</p>
            )}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 -mt-4">{errors.password}</p>
            )}
            <select
              name="securityQuestion"
              value={formData.securityQuestion}
              onChange={handleChange}
              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.securityQuestion
                  ? "border-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
            >
              <option value="">Select a security question</option>
              <option value="pet">What is the name of your first pet?</option>
              <option value="mother">What is your mother's maiden name?</option>
              <option value="city">What city were you born in?</option>
            </select>
            {errors.securityQuestion && (
              <p className="text-sm text-red-500 -mt-4">
                {errors.securityQuestion}
              </p>
            )}
            <input
              type="text"
              name="securityAnswer"
              placeholder="Your answer"
              value={formData.securityAnswer}
              onChange={handleChange}
              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.securityAnswer
                  ? "border-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
            />
            {errors.securityAnswer && (
              <p className="text-sm text-red-500 -mt-4">
                {errors.securityAnswer}
              </p>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-red-600">
              Terms and Conditions
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-64 overflow-y-scroll">
              <p className="text-sm text-gray-700 leading-relaxed">
                By continuing, you agree to the following terms and conditions.
                These terms govern your use of our online banking services. We
                may update these terms from time to time, and your continued use
                constitutes acceptance of the new terms. Your privacy is
                important to us. We collect, use, and share information as
                described in our Privacy Policy.
                <br />
                <br />
                Security is a shared responsibility. You are responsible for
                keeping your login credentials confidential. Notify us
                immediately of any unauthorized use of your account. We reserve
                the right to suspend or terminate your account at any time for
                any reason.
              </p>
            </div>
            <label className="flex items-center space-x-3 text-gray-700">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className={`h-5 w-5 text-red-600 rounded focus:ring-red-500 ${
                  errors.termsAccepted ? "border-red-500" : ""
                }`}
              />
              <span>I accept the terms and conditions.</span>
            </label>
            {errors.termsAccepted && (
              <p className="text-sm text-red-500 mt-2">
                {errors.termsAccepted}
              </p>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-red-600">
              Review Your Details
            </h2>
            <p className="text-gray-600">
              Please review your information carefully before submitting.
            </p>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-gray-700">
                  <span className="font-semibold text-gray-900">
                    Full Name:
                  </span>{" "}
                  {formData.fullName}
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold text-gray-900">
                    Date of Birth:
                  </span>{" "}
                  {formData.dob}
                </div>

                <div className="text-gray-700">
                  <span className="font-semibold text-gray-900">Email:</span>{" "}
                  {formData.email}
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold text-gray-900">Phone:</span>{" "}
                  {formData.phone}
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold text-gray-900">Username:</span>{" "}
                  {formData.username}
                </div>
              </div>
              <div className="mt-4">
                <span className="font-semibold text-gray-900">Address:</span>{" "}
                {formData.address}
              </div>
              <div className="mt-4">
                <span className="font-semibold text-gray-900">SSN:</span>{" "}
                {formData.ssn}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {success ? (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm text-center transform scale-100 transition-transform duration-300">
            <div className="text-green-500 text-6xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 mx-auto"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Enrollment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for enrolling. You can now log in to your new online
              banking account.
            </p>
            <button
              onClick={() => (setSuccess(false), nav("/"))}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-full font-semibold shadow-md hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-red-700 text-center mb-2">
              Online Banking Enrollment
            </h1>
            <p className="text-sm sm:text-base text-gray-500 text-center mb-8 sm:mb-12">
              A few steps to get you started with online banking.
            </p>

            {/* Progress Bar */}
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
                      {step.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Show existing account block if user exists */}
            {isExisting && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-lg space-y-4 mb-6">
                <h2 className="font-bold text-lg">Online Access Exists</h2>
                <p>This user already has an online access account.</p>
                <div className="flex gap-4">
                  <Link
                    to="/"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Go to Login
                  </Link>
                  <Link
                    to="/forgot-password"
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    Forgot Password
                  </Link>
                </div>
              </div>
            )}

            {/* Show form only if no existing account */}
            {!isExisting && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {renderCurrentStep()}

                {error && (
                  <div className="flex flex-col gap-5">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-6 py-3 border border-red-600 text-red-600 font-semibold rounded-full shadow-sm hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition-colors"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineEnrollment;
