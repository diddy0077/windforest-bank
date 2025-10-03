import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

const UpdateSecurityQuestionsForm = ({
  openQuestion,
  setOpenQuestion,
  setNotifications,
}) => {
  const securityQuestions = [
    "What was the name of your first pet?",
    "In what city were you born?",
    "What is your mother's maiden name?",
  ];
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const { currentUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const updateQuestion = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!question || !answer) {
        setError("All fields are required!");
        toast.error("All fields are required!");
        return;
      }
      const newNotification = {
        id: crypto.randomUUID(),
        type: "success",
        message:
          "Your security question was updated. If you didn't recognize this change, please contact customer support immediately!",
        date: new Date().toISOString(),
        read: false,
      };
      const res2 = await fetch("http://localhost:5000/onlineAccessUsers");
      const onlineUsers = await res2.json();
      const matchedUser = onlineUsers.find(
        (user) => user.userId === currentUser.id
      );

      const response = await fetch(
        `http://localhost:5000/onlineAccessUsers/${matchedUser.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            securityQuestion: question,
            securityAnswer: answer,
          }),
        }
      );
      if (!response.ok) {
        throw {
          message: "Error Updating security question",
        };
      }
      await new Promise((resolve) => setTimeout(resolve, 3000)); // simulate delay
      const res = await fetch(`http://localhost:5000/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifications: [...currentUser.notifications, newNotification],
        }),
      });
      if (!res.ok) {
        throw {
          message: "Error fetching user",
        };
      }
      setNotifications((prev) => [...prev, newNotification]);
      toast.success("Security question updated!");
      setOpenQuestion(false);
      setAnswer("");
      setQuestion("");
    } catch (error) {
      console.log("Error updating security question", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        openQuestion
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      } flex justify-center items-center min-h-screen font-sans fixed h-screen inset-0 z-40 transition-all duration-300`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpenQuestion(false)}
      ></div>
      {/* Form Container */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 relative mx-4">
        <button
          onClick={() => setOpenQuestion(false)}
          className="absolute top-4 right-4"
        >
          <svg
            className="fill-red-600 cursor-pointer"
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
          {/* Question Mark Icon */}
          <div className="w-24 h-24 rounded-full bg-red-600 text-white flex items-center justify-center text-4xl font-bold mb-4 border-4 border-red-600 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.44 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.29-.62 2.4-1.64 3.16z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-1">
            Update Security Questions
          </h1>
          <p className="text-center text-gray-500 text-lg">
            Help us keep your account secure by updating your questions.
          </p>
        </div>

        <form onSubmit={updateQuestion} className="space-y-6">
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700"
            >
              Question:
            </label>
            <select
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
              id="question"
              name="question"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
            >
              {securityQuestions.map((q, index) => (
                <option key={index} value={q}>
                  {q}
                </option>
              ))}
            </select>
            <div className="mt-3">
              <label
                htmlFor="answer"
                className="block text-sm font-medium text-gray-700"
              >
                Answer:
              </label>
              <input
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
                type="text"
                id="answer"
                name="answer"
                placeholder="Your answer"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
              />
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors cursor-pointer"
            >
              {loading ? "Updating..." : "Update Questions"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSecurityQuestionsForm;
