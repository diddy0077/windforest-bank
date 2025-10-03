import React, { createContext, useState, useEffect } from 'react';


export const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Periodic refresh of user data to reflect admin changes
  useEffect(() => {
    if (!currentUser) return;

    const refreshUserData = async () => {
      try {
        const res = await fetch(`https://windforest-json-server.onrender.com/users/${currentUser.id}`);
        if (res.ok) {
          const updatedUser = await res.json();
          setCurrentUser(updatedUser);
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };

    // Refresh every 30 seconds
    const interval = setInterval(refreshUserData, 5000);

    return () => clearInterval(interval);
  }, [currentUser?.id]);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, setCurrentUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
