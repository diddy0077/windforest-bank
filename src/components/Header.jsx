import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  const { login } = useContext(UserContext);
  const nav = useNavigate();

  const FALLBACK_IMAGE_URL = "https://via.placeholder.com/800x600?text=Bank+Image";

  // --- Step 1: Username & Password submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!userName) {
      setError("Username is required");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://windforest-json-server.onrender.com/onlineAccessUsers"
      );
      if (!res.ok) throw new Error("Error fetching online users");
      const onlineUsers = await res.json();

      const matchedUser = onlineUsers.find(
        (user) =>
          user.username.toLowerCase().trim() ===
            userName.toLowerCase().trim() &&
          user.password.toLowerCase().trim() === password.toLowerCase().trim()
      );

      if (!matchedUser) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }

      const usersRes = await fetch(
        "https://windforest-json-server.onrender.com/users"
      );
      const users = await usersRes.json();
      const fullUser = users.find((u) => u.id === matchedUser.userId);

      // Send OTP
      console.log("Attempting to send OTP to email:", fullUser?.email);
      const otpRes = await fetch(
        "https://windforest-bank.onrender.com/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: fullUser.email }),
        }
      );
      console.log("OTP send response status:", otpRes.status);
      console.log("OTP send response ok:", otpRes.ok);

      if (!otpRes.ok) throw new Error("Failed to send OTP");

      setTempUser({ fullUser, matchedUser }); // store both users temporarily
      setShowOtpInput(true);
      setLoading(false);
    } catch (err) {
      console.log("Login error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // --- Step 2: OTP verification ---
  const handleOtpSubmit = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { fullUser, matchedUser } = tempUser;

      const res = await fetch(
        "https://windforest-bank.onrender.com/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: fullUser.email, otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      // ✅ OTP verified → update lastLogin
      const lastLogin = new Date().toISOString();
      await fetch(
        `https://windforest-json-server.onrender.com/onlineAccessUsers/${matchedUser.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lastLogin }),
        }
      );

      // — Add a 2-second delay to show loading
      await new Promise((resolve) => setTimeout(resolve, 3000));

      login({ ...fullUser, lastLogin });
      nav("/account-dashboard");
    } catch (err) {
      console.log("OTP error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function maskEmail(email) {
    const [local, domain] = email.split("@");

    if (local.length <= 2) {
      return local[0] + "*@" + domain;
    }

    return (
      local[0] +
      "*".repeat(local.length - 2) +
      local[local.length - 1] +
      "@" +
      domain
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <header className="w-full">
        <div className="relative w-full flex flex-col md:flex-row pt-8 md:pt-0 space-y-8 px-4">
          <div className="w-full md:w-1/3 flex items-center justify-center p-6 md:p-12 z-10 bg-gray-900 shadow-lg mx-auto md:m-8 rounded-lg text-gray-200">
            <aside className="w-full max-w-sm">
              <h2 className="text-xl font-semibold">Good afternoon</h2>
              <p className="text-sm text-gray-400 mb-6">
                Sign on to manage your accounts.
              </p>

              {!showOtpInput ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="username"
                      className="block text-sm text-gray-400 mb-1"
                    >
                      Username
                    </label>
                    <input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      type="text"
                      id="username"
                      className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Username"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-sm text-gray-400 mb-1"
                    >
                      Password
                    </label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      id="password"
                      className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Password"
                    />
                  </div>
                  {error && <p className="text-red-600">{error}</p>}
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="cursor-pointer w-full py-2 bg-red-700 text-white font-semibold rounded-md shadow-md hover:bg-red-800 transition-colors"
                    >
                      {loading ? "Signing in..." : "Sign On"}
                    </button>
                    <Link
                      to="/online-enrollment"
                      className="w-full flex items-center justify-center py-2 text-red-700 border border-3 border-red-700 font-semibold rounded-md shadow-md hover:bg-red-900 hover:text-white transition-colors"
                    >
                      Enroll
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400">
                    Enter the OTP sent to your email:{" "}
                    {tempUser && maskEmail(tempUser.fullUser.email)}
                  </p>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="OTP"
                    className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={handleOtpSubmit}
                    className="w-full py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              )}

              <div className="mt-6 text-sm text-gray-400 space-y-2">
                <Link
                  to="/forgot-password"
                  className="block hover:underline hover:text-red-700"
                >
                  Forgot username or password?
                </Link>
                <Link
                  to=""
                  className="block hover:underline hover:text-red-700"
                >
                  Security Center
                </Link>
                <Link
                  to=""
                  className="block hover:underline hover:text-red-700"
                >
                  Privacy, Cookies, and Legal
                </Link>
              </div>
            </aside>
          </div>

          {/* FIX: Set responsive height and add onError handler */}
          <div className="relative w-full md:w-2/3 h-[50vh] md:h-[90vh] overflow-hidden rounded-lg md:m-8">
            <div className="absolute inset-0  md:block">
              <img
                src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2940&auto=format&fit=crop"
                alt="Financial professional working with a client"
                className="w-full h-full object-cover object-center"
                // This handler ensures a reliable image loads if the external URL fails.
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE_URL;
                }}
              />
              <div className="absolute inset-0 bg-red-900 opacity-60"></div>
            </div>
            {/* FIX: Replaced motion.div with standard div */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white z-10"
              /* initial="hidden" 
              animate="visible"
              variants={sectionVariants} */
            >
              {/* FIX: Replaced motion.h1 with standard h1 */}
              <h1
                className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter"
                /* variants={itemVariants} */
              >
                Your Future is Our Focus.
              </h1>

              <p
                className="mt-4 text-lg md:text-xl max-w-xl mx-auto"
                /* variants={itemVariants} */
              >
                Partner with us to achieve your financial goals with confidence
                and ease.
              </p>
              {/* FIX: Replaced motion.button with standard button */}
              <button
                className="cursor-pointer mt-8 px-8 py-3 bg-red-700 border-2 border-white text-white font-semibold rounded-full shadow-md hover:bg-red-800 transition-colors"
                /* variants={itemVariants} */
              >
                Explore Our Solutions &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
