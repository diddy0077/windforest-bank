import React, { useState } from "react";
import { EyeOff, EyeIcon, LucideEye } from "lucide-react";
import { SidebarCloseIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const UpdatePasswordForm = ({
  setOpenPassword,
  openPassword,
  setNotifications,
}) => {
  const [firstEye, setFirstEye] = useState(false);
  const [secondEye, setSecondEye] = useState(false);
  const [thirdEye, setThirdEye] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!currentPassword) {
      setError("You must enter your current password to change your password!");
      toast.error(
        "You must enter your current password to change your password!"
      );
      return;
    }
    if (currentPassword.length < 6 || newPassword.length < 6) {
      setError("Password cannot be less than 6 characters!");
      toast.error("Password cannot be less than 6 characters!");
      return;
    }
    if (!newPassword) {
      setError("Password field is required!");
      toast.error("Password field is required!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Password's do not match!");
      toast.error("Password's do not match!");
      return;
    }
    try {
      const res = await fetch(
        "https://windforest-json-server.onrender.com/onlineAccessUsers"
      );
      if (!res.ok) {
        throw { message: "Error fetching online users!" };
      }
      const onlineUsers = await res.json();
      const matchedUser = onlineUsers.find(
        (user) => user.userId === currentUser.id
      );
      if (currentPassword !== matchedUser.password) {
        setError("Incorrect Password!");
        toast.error("Incorrect Password!");
        return;
      }
      if (newPassword === matchedUser.password) {
        setError("New password must be different from old password!");
        toast.error("New password must be different from old password!");
        return;
      }
      const updatedUser = { ...matchedUser, password: newPassword };
      const response = await fetch(
        `https://windforest-json-server.onrender.com/onlineAccessUsers/${matchedUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!response.ok) {
        throw {
          message: "Error updating password",
        };
      }
      const newNotification = {
        id: crypto.randomUUID(),
        type: "success",
        message:
          "Your password was changed. If you didn't recognize this change, please contact customer support immediately!",
        date: new Date().toISOString(),
        read: false,
      };
      const response2 = await fetch(
        `https://windforest-json-server.onrender.com/users/${currentUser.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notifications: [...currentUser.notifications, newNotification],
          }),
        }
      );
      if (!response2) {
        throw {
          message: "Error updating notification",
        };
      }
      setNotifications((prev) => [...prev, newNotification]);
      setCurrentUser({ ...currentUser, password: newPassword });
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...currentUser, password: newPassword })
      );
      const data = await response.json();
      console.log(data);
      toast.success("Password Updated!");
      setOpenPassword(false);
    } catch (error) {
      console.log("Error updating password!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        openPassword
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } flex justify-center items-center min-h-screen fixed h-screen inset-0 z-40 transition-all duration-300`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpenPassword(false)}
      ></div>
      {/* Form Container */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 mx-4 overflow-y-auto z-50 relative">
        <button
          onClick={() => setOpenPassword(false)}
          className="absolute top-4 right-4 cursor-pointer"
        >
          <svg
            className="fill-red-600"
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          {/* Lock Icon */}
          <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center text-4xl font-bold mb-4 border-4 border-red-600 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-9 h-9"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 10h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2zm-2 0H8V7c0-2.21 1.79-4 4-4s4 1.79 4 4v3zm-4 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
          </div>
          <h1 className="md:text-4xl text-3xl font-extrabold text-gray-800 text-center mb-1">
            Update Password
          </h1>
          <p className="text-center text-gray-500 text-lg">
            Your security is our priority. Please choose a strong password.
          </p>
        </div>

        <form onSubmit={updatePassword} className="space-y-6">
          {/* Current Password Input */}
          <div className="relative">
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <input
              type={firstEye ? "text" : "password"}
              onChange={(e) => setCurrentPassword(e.target.value)}
              value={currentPassword}
              id="current-password"
              name="current-password"
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
            />
            <div
              onClick={() => setFirstEye((prev) => !prev)}
              className="absolute top-9 right-3 cursor-pointer"
            >
              {firstEye ? (
                <LucideEye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </div>
          </div>

          {/* New Password Input */}
          <div className="relative">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type={secondEye ? "text" : "password"}
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              id="new-password"
              name="new-password"
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
            />
            <div
              onClick={() => setSecondEye((prev) => !prev)}
              className="absolute top-9 right-3 cursor-pointer"
            >
              {secondEye ? (
                <LucideEye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </div>
          </div>

          {/* Confirm New Password Input */}
          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type={thirdEye ? "text" : "password"}
              id="confirm-password"
              name="confirm-password"
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
            />
            <div
              onClick={() => setThirdEye((prev) => !prev)}
              className="absolute top-9 right-3 cursor-pointer"
            >
              {thirdEye ? (
                <LucideEye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
