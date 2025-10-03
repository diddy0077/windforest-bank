import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import EditProfileForm from "./EditProfileForm";
import { useOutletContext, Link } from "react-router-dom";
import UpdatePasswordForm from "./UpdatePasswordForm";
import UpdateSecurityQuestionsForm from "./UpdateSecurityQuestionsForm";
import Authentication from "./Authentication";
import { toast } from "react-toastify";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const context = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { setNotifications, setIsSidebarOpen } = useOutletContext();
  const [openQuestion, setOpenQuestion] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [isEnabled3, setIsEnabled3] = useState(false);

  function mask(num) {
    const str = num.toString();
    const last4 = str.slice(-4); // last 4 digits
    const masked = "*".repeat(str.length - 4); // mask the rest
    return masked + last4;
  }

  const unlinkAccount = async (id) => {
    const updatedAccounts = context.currentUser.linkedAccounts.filter(
      (acc) => acc.id !== id
    );

    const res = await fetch(
      `https://windforest-json-server.onrender.com/users/${context.currentUser.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linkedAccounts: updatedAccounts }),
      }
    );

    const data = await res.json();
    context.setCurrentUser(data);
    toast.success("Account successfully unlinked!");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-8">
            {/* Main Profile Header */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 pb-8 border-b border-gray-200">
              <div
                alt="Profile"
                className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center border-4 border-white shadow-lg"
              >
                <p className="font-bold text-white text-4xl">
                  {context?.currentUser?.fullName.slice(0, 1) || "N/A"}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold text-gray-800">
                  {context.currentUser.fullName}
                </h2>
                <p className="text-lg text-gray-500">Member since 2025</p>
                <div className="mt-2 text-sm font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0">
                  <span className="inline-block w-2 h-2 mr-1 rounded-full bg-green-500"></span>{" "}
                  Active
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg">
                <p className="text-lg font-semibold opacity-80">
                  Total Balance
                </p>
                <p className="text-4xl font-extrabold mt-1">
                  ${context.currentUser.accountBalance.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg">
                <p className="text-lg font-semibold opacity-80">
                  Primary Account
                </p>
                <p className="text-2xl font-bold mt-1">
                  {context.currentUser.accountTy}
                </p>
                <p className="text-sm opacity-60">
                  •••{context.currentUser.accountNumber.slice(-4)}
                </p>
              </div>
            </section>

            {/* Personal Information */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Personal Information
                </h2>
                <button
                  onClick={() => setIsOpen(true)}
                  className="cursor-pointer text-red-600 font-medium hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row justify-between border-b border-gray-200 pb-2">
                  <p className="text-lg text-gray-700 font-medium">
                    Email Address
                  </p>
                  <p className="text-lg text-gray-900 break-all">
                    {context.currentUser.email}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between border-b border-gray-200 pb-2">
                  <p className="text-lg text-gray-700 font-medium">
                    Phone Number
                  </p>
                  <p className="text-lg text-gray-900">
                    {context.currentUser.phone}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between">
                  <p className="text-lg text-gray-700 font-medium">
                    Home Address
                  </p>
                  <p className="text-lg text-gray-900 text-right sm:text-left">
                    {context.currentUser.address}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between">
                  <p className="text-lg text-gray-700 font-medium">
                    Social Security Number
                  </p>
                  <p className="text-lg text-gray-900 text-right sm:text-left">
                    {mask(context.currentUser.ssn)}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between">
                  <p className="text-lg text-gray-700 font-medium">
                    Employer Name
                  </p>
                  <p className="text-lg text-gray-900 text-right sm:text-left">
                    {context.currentUser.employerName}
                  </p>
                </div>
              </div>
            </section>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Security & Access
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setOpenPassword(true)}
                  className="cursor-pointer bg-gray-100 text-gray-800 py-6 px-4 rounded-xl shadow hover:bg-gray-200 transition text-left"
                >
                  <p className="font-semibold text-lg">Update Password</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Change your current password.
                  </p>
                </button>
                <button
                  onClick={() => setOpenAuth(true)}
                  className="cursor-pointer bg-gray-100 text-gray-800 py-6 px-4 rounded-xl shadow hover:bg-gray-200 transition text-left"
                >
                  <p className="font-semibold text-lg">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Add an extra layer of security.
                  </p>
                </button>
                <button
                  onClick={() => setOpenQuestion(true)}
                  className="cursor-pointer bg-gray-100 text-gray-800 py-6 px-4 rounded-xl shadow hover:bg-gray-200 transition text-left"
                >
                  <p className="font-semibold text-lg">
                    Manage Security Questions
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Update questions for account recovery.
                  </p>
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Notification Preferences
              </h2>
              <div className="bg-gray-100 p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-gray-800">
                    Email Notifications
                  </p>
                  <button
                    onClick={() => setIsEnabled1((prev) => !prev)}
                    className={`${
                      isEnabled1 ? "justify-end bg-red-600" : "bg-gray-400"
                    } w-11 h-6 rounded-full flex items-center p-[.1rem] cursor-pointer cursor-pointer transition duration-300`}
                  >
                    <div className="bg-white w-5 h-5 rounded-full transition duration-300"></div>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-gray-800">
                    SMS Alerts
                  </p>
                  <button
                    onClick={() => setIsEnabled2((prev) => !prev)}
                    className={`${
                      isEnabled2 ? "justify-end bg-red-600" : "bg-gray-400"
                    } w-11 h-6 rounded-full flex items-center p-[.1rem] cursor-pointer cursor-pointer transition duration-300`}
                  >
                    <div className="bg-white w-5 h-5 rounded-full transition duration-300"></div>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-gray-800">
                    Push Notifications
                  </p>
                  <button
                    onClick={() => setIsEnabled3((prev) => !prev)}
                    className={`${
                      isEnabled3 ? "justify-end bg-red-600" : "bg-gray-400"
                    } w-11 h-6 rounded-full flex items-center p-[.1rem] cursor-pointer cursor-pointer transition duration-300`}
                  >
                    <div className="bg-white w-5 h-5 rounded-full transition duration-300"></div>
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Linked Accounts
              </h2>
              <div className="bg-gray-100 p-6 rounded-xl space-y-4 flex flex-col">
                {context.currentUser.linkedAccounts.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {context?.currentUser?.linkedAccounts?.map((acc) => (
                      <div
                        key={acc.id}
                        className="flex justify-between items-center"
                      >
                        <p className="text-lg text-gray-700">
                          <span className="font-medium text-gray-900">
                            {acc?.linkedUserName}
                          </span>{" "}
                          (•••{acc?.accountNumber?.slice(-4)})
                        </p>
                        <button
                          onClick={() => unlinkAccount(acc.id)}
                          className="hover:underline cursor-pointer text-red-600 hover:text-red-800 transition"
                        >
                          Unlink
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No external accounts linked yet.</p>
                )}
                <Link
                  to="/account-dashboard/link-accounts"
                  className="w-full text-red-600 font-bold border border-red-600 py-3 rounded-xl hover:bg-red-50 transition px-4 flex items-center justify-center hover:bg-red-600 hover:text-white duration-300"
                >
                  + Link New Account
                </Link>
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-6 sm:p-10 bg-gray-100 min-h-screen font-sans">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-red-600">
            My Account
          </h1>
        </div>
        <p className="text-gray-500 mt-1">
          Manage your profile and settings here.
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 mb-8">
        <button
          onClick={() => setActiveTab("profile")}
          className={`py-3 cursor-pointer px-6 text-xl font-medium transition-colors ${
            activeTab === "profile"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-3 cursor-pointer px-6 text-xl font-medium transition-colors ${
            activeTab === "settings"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Settings
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl p-8">
        <div className="">{renderContent()}</div>
        <EditProfileForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setNotifications={setNotifications}
        />
        <UpdatePasswordForm
          openPassword={openPassword}
          setOpenPassword={setOpenPassword}
          setNotifications={setNotifications}
        />
        <UpdateSecurityQuestionsForm
          openQuestion={openQuestion}
          setOpenQuestion={setOpenQuestion}
          setNotifications={setNotifications}
        />
        <Authentication openAuth={openAuth} setOpenAuth={setOpenAuth} />
      </div>
    </div>
  );
};

export default Profile;
