import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

const EditProfileForm = ({ isOpen, setIsOpen, setNotifications }) => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const saveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Email field is required!");
      setLoading(false);
      return;
    }
    if (!address) {
      setError("Address field is required!");
      setLoading(false);
      return;
    }
    if (!phone) {
      setError("Phone field is required!");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("For security purposes, you must confirm your password!");
      setLoading(false);
      return;
    }

    try {
      // Get online access users
      const res = await fetch(`http://localhost:5000/onlineAccessUsers`);
      if (!res.ok) throw new Error("Error fetching online users.");
      const onlineUsers = await res.json();

      const matchedUser = onlineUsers.find(
        (user) => user.userId === currentUser.id
      );

      if (!matchedUser || password !== matchedUser.password) {
        setError("Incorrect password, please try again.");
        setLoading(false);
        return;
      }
      const newNotification = {
        id: crypto.randomUUID(),
        type: "success",
        message:
          "A change was made to your profile. If you didn't recognize this change, please contact customer support immediately!",
        date: new Date().toISOString(),
        read: false,
      };
      // Build updated user object
      const updatedUser = {
        ...currentUser,
        email,
        phone,
        address,
        notifications: [...currentUser.notifications, newNotification],
      };

      setNotifications((prev) => [...prev, newNotification]);
      // Update in users DB
      const response = await fetch(
        `http://localhost:5000/users/${currentUser.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) throw new Error("Error updating information");

      await new Promise((resolve) => setTimeout(resolve, 3000)); // simulate delay

      const data = await response.json();
      setCurrentUser({ ...currentUser, ...data });
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Error updating information", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      } flex justify-center items-center min-h-screen font-sans fixed h-screen inset-0 z-40 transition-all duration-300`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Form Container */}
      <div className="w-full mx-4 max-w-lg bg-white rounded-3xl shadow-2xl p-8 z-50 max-h-[600px] overflow-y-auto relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4"
        >
          <svg
            className="fill-red-600 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            height="34px"
            viewBox="0 -960 960 960"
            width="34px"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-red-600 text-white flex items-center justify-center text-4xl font-bold mb-4 border-4 border-red-600 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.93 0 3.5 1.57 3.5 3.5S13.93 12 12 12s-3.5-1.57-3.5-3.5S10.07 5 12 5zm0 14.2c-2.67 0-5.34-1.33-8-4 2.66-2.67 5.33-4 8-4s5.33 1.33 8 4c-2.66 2.67-5.33 4-8 4z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-1">
            Update Profile
          </h1>
          <p className="text-center text-gray-500 text-lg">
            Manage your personal and security information.
          </p>
        </div>

        <form onSubmit={saveChanges} className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              Personal Information
            </h2>
            <div className="space-y-6">
              {/* Email Input */}
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

              {/* Phone Number Input */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="e.g., +1 (555) 123-4567"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>

              {/* Address Input */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  type="text"
                  id="address"
                  name="address"
                  placeholder="e.g., 123 Main Street, City, State 12345"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              Security
            </h2>
            <div className="space-y-6">
              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-md font-semibold text-gray-900"
                >
                  Confirm your password to save changes.
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors cursor-pointer"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
