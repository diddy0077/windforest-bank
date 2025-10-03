import React, { useState, useContext } from "react";
import NotificationDetailModal from "./NotificationDetailModal";
import { UserContext } from "./UserContext";

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  setNotifications,
}) {
  const { currentUser } = useContext(UserContext);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const markAsRead = (notification) => {
    setSelectedNotification(notification);
    setDetailOpen(true);

    const updatedNotifications = notifications.map((n) =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);

    // Optional: persist to backend
    fetch(`http://localhost:5000/users/${currentUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notifications: updatedNotifications }),
    }).catch((err) => console.log("Error updating notifications:", err));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      read: true,
    }));
    setNotifications(updatedNotifications);

    fetch(`http://localhost:5000/users/${currentUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notifications: updatedNotifications }),
    }).catch((err) => console.log("Error updating notifications:", err));
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative z-10 bg-white mx-2 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 transform transition-all duration-300 scale-100">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer absolute top-2 right-4"
          >
            &times;
          </button>
          <div className="flex justify-between items-center my-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Notifications
            </h2>
            <button
              onClick={markAllAsRead}
              className="text-sm text-red-600 font-medium hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center">No notifications yet.</p>
          ) : (
            <ul className="space-y-3">
              {notifications
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((n) => (
                  <li
                    key={n.id}
                    onClick={() => markAsRead(n)}
                    className={`cursor-pointer p-4 rounded-lg shadow flex justify-between items-start transition-colors ${
                      n.read ? "bg-gray-50" : "bg-red-50"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm mb-1 ${
                          n.type === "success"
                            ? "text-green-600"
                            : n.type === "error"
                            ? "text-red-600"
                            : "text-blue-600"
                        } font-semibold`}
                      >
                        {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
                      </p>
                      <p
                        className={`text-gray-700 text-sm ${
                          !n.read ? "font-medium" : ""
                        }`}
                      >
                        {n.message}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {new Date(n.date).toLocaleString()}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <NotificationDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        notification={selectedNotification}
      />
    </>
  );
}
