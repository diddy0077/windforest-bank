import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleStep1 = async () => {
    setLoading(true);
    if (!email) {
      toast.error("Email address field is required!");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/users");
      if (!res.ok) {
        throw {
          message: "Error fetching users",
        };
      }
      const users = await res.json();
      const matchedUser = users.find(
        (user) => user.email === email.trim().toLowerCase()
      );
      if (!matchedUser) {
        toast.error("No account found with that email address in our records!");
        return;
      }
      setUserEmail(matchedUser.email);
      setEmail("");
      setStep(2);
      const res2 = await fetch("http://localhost:5000/onlineAccessUsers");
      const onlineUsers = await res2.json();
      const matchedOnlineUser = onlineUsers.find(
        (user) => user.userId === matchedUser.id
      );
      setUserQuestion(matchedOnlineUser.securityQuestion);
    } catch (error) {
      console.log("Error fetching users!", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    setLoading(true);
    if (!answer) {
      toast.error("Please kindly provide answer to your security question!");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/users");
      if (!res.ok) {
        throw {
          message: "Error fetching users",
        };
      }
      const users = await res.json();
      const matchedUser = users.find(
        (user) => user.email === userEmail.trim().toLowerCase()
      );
      const res2 = await fetch("http://localhost:5000/onlineAccessUsers");
      const onlineUsers = await res2.json();
      const matchedOnlineUser = onlineUsers.find(
        (user) => user.userId === matchedUser.id
      );
      if (
        matchedOnlineUser.securityAnswer.toLowerCase() !== answer?.toLowerCase()
      ) {
        toast.error("Incorrect security answer!");
        return;
      }
      setStep(3);
      setAnswer("");
    } catch (error) {
      console.log("Error fetching users!", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async () => {
    setLoading(true);
    if (!newPassword || !confirmPassword) {
      toast.error("All password fields are required!");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password's do not match!");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6 || confirmPassword.length < 6) {
      toast.error("Password cannot be less than 6 characters!");
      setLoading(false);
      return;
    }
    try {
      const res2 = await fetch("http://localhost:5000/users");
      const users = await res2.json();
      const user = users.find((u) => u.email === userEmail);
      const res = await fetch("http://localhost:5000/onlineAccessUsers");
      const onlineUsers = await res.json();
      const matchedUser = onlineUsers.find((user) => user.userId === user.id);
      const updatedUser = {
        ...matchedUser,
        password: newPassword,
      };
      const response = await fetch(
        `http://localhost:5000/onlineAccessUsers/${matchedUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );
      const data = await response.json();
      console.log(data);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success("Password updated successfully!");
      nav("/");

      const newNotification = {
        id: crypto.randomUUID(),
        type: "success",
        message:
          "Your password was changed. If you didn't recognize this change, please contact customer support immediately!",
        date: new Date().toISOString(),
        read: false,
      };
      const res3 = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notifications: [...user.notifications, newNotification],
        }),
      });
      if (!res3.ok) {
        throw {
          message: "Error Updating notifications",
        };
      }
    } catch (error) {
      toast.error(
        "Sorry an error occurred, couldn't reset your password, try again later."
      );
      console.log("Error resetting password", error);
    } finally {
      setLoading(false);
    }
  };

  const renderFormContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-1">
              Forgot Password
            </h1>
            <p className="text-center text-gray-500 text-md mb-8">
              Enter your email to begin the reset process.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="e.g., yourname@example.com"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>
              <button
                type="button"
                onClick={handleStep1}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors cursor-pointer"
              >
                Continue
              </button>
            </form>
          </>
        );
      case 2:
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-1">
              Verify Identity
            </h1>
            <p className="text-center text-gray-500 text-md mb-8">
              Please answer your security question to continue.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Mock Security Question 2 */}
              <div>
                <label
                  htmlFor="question"
                  className="block text-sm font-medium text-gray-700"
                >
                  {userQuestion}
                </label>
                <input
                  onChange={(e) => setAnswer(e.target.value)}
                  value={answer}
                  type="text"
                  id="answer"
                  name="answer"
                  placeholder="Your answer"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>

              <button
                type="button"
                onClick={handleStep2}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors cursor-pointer"
              >
                Verify
              </button>
            </form>
          </>
        );
      case 3:
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-1">
              Reset Password
            </h1>
            <p className="text-center text-gray-500 text-md mb-8">
              Enter a new, strong password below.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  type="password"
                  id="new-password"
                  name="new-password"
                  placeholder="••••••••"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="••••••••"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>
              <button
                onClick={handleStep3}
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors cursor-pointer duration-300"
              >
                {loading ? "Resetting" : "Reset Password"}
              </button>
            </form>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
      {/* Form Container */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 mx-4">
        {/* Header Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-red-600 text-white flex items-center justify-center text-4xl font-bold mb-4 border-4 border-red-600 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 10h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2zm-2 0H8V7c0-2.21 1.79-4 4-4s4 1.79 4 4v3zm-4 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
          </div>
          {renderFormContent()}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
