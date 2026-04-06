// Centralized API configuration
// This file contains the base URL for the Express API

// For local development, use localhost:7000
// For production, use your deployed server URL
const API_BASE_URL = 'http://localhost:7000/api';

// For production, uncomment the line below and comment out the localhost line:
// const API_BASE_URL = 'https://windforest.capital/api';

// Export individual API endpoints for convenience
export const API_ENDPOINTS = {
  // Users
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  USER_BY_ACCOUNT: (accountNumber) => `${API_BASE_URL}/users?accountNumber=${accountNumber}`,
  USER_BY_EMAIL: (email) => `${API_BASE_URL}/users?email=${email}`,

  // Transactions
  TRANSACTIONS: `${API_BASE_URL}/transactions`,
  TRANSACTION_BY_ID: (id) => `${API_BASE_URL}/transactions/${id}`,
  TRANSACTIONS_BY_USER: (userId) => `${API_BASE_URL}/transactions?fromUserId=${userId}`,

  // Online Access Users
  ONLINE_ACCESS_USERS: `${API_BASE_URL}/onlineAccessUsers`,
  ONLINE_ACCESS_USER_BY_ID: (id) => `${API_BASE_URL}/onlineAccessUsers/${id}`,
  ONLINE_ACCESS_USER_BY_USERNAME: (username) => `${API_BASE_URL}/onlineAccessUsers?username=${username}`,

  // Account Types
  ACCOUNT_TYPES: `${API_BASE_URL}/accountTypes`,
  ACCOUNT_TYPE_BY_ID: (id) => `${API_BASE_URL}/accountTypes/${id}`,
  ACCOUNT_TYPE_BY_NAME: (name) => `${API_BASE_URL}/accountTypes?name=${name}`,

  // Loans
  LOANS: `${API_BASE_URL}/loans`,
  LOAN_BY_ID: (id) => `${API_BASE_URL}/loans/${id}`,
  LOANS_BY_USER: (userId) => `${API_BASE_URL}/loans?userId=${userId}`,
  LOANS_BY_STATUS: (status) => `${API_BASE_URL}/loans?status=${status}`,

  // Auth
  SEND_OTP: `${API_BASE_URL}/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/verify-otp`,
  LOGIN_CONFIRMATION: `${API_BASE_URL}/login-confirmation`,

  // Notifications
  SEND_TRANSFER_NOTIFICATION: `${API_BASE_URL}/send-transfer-notification`
};

export default API_BASE_URL;
