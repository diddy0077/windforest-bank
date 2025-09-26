export const addNotification = async (userId, notification) => {
  try {
    // Fetch current user data
    const res = await fetch(`http://localhost:5000/users/${userId}`);
    const user = await res.json();

    const updatedNotifications = [
      ...(user.notifications || []),
      notification,
    ];

    // PATCH updated notifications array
    await fetch(`http://localhost:5000/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notifications: updatedNotifications }),
    });

    return updatedNotifications; // return for updating state locally if needed
  } catch (err) {
    console.log("Error adding notification:", err);
  }
};
