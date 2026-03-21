// Initial database data for Express server
// This replaces the JSON server database

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'db.json');

// Default data structure
const defaultData = {
  users: [
    {
      id: "8016",
      isTransferEnabled: false,
      fullName: "Jane Doe",
      dob: "1998-09-09",
      ssn: "11111111111",
      email: "danieludeh007@yahoo.com",
      phone: "09048947208",
      address: "20 bale Street, Orile iganmu",
      employment: "employed",
      income: "100000",
      employerName: "Daniel",
      initialDeposit: 100,
      debitCard: true,
      onlineBanking: true,
      accountType: "Checking Account",
      accountNumber: "1066747311",
      accountBalance: 10030.999999999996,
      role: "user",
      loans: [],
      notifications: []
    },
    {
      id: "8017",
      isTransferEnabled: true,
      fullName: "John Smith",
      dob: "1985-05-15",
      ssn: "22222222222",
      email: "john.smith@email.com",
      phone: "5551234567",
      address: "123 Main St, New York, NY",
      employment: "employed",
      income: "75000",
      employerName: "ABC Corp",
      initialDeposit: 500,
      debitCard: true,
      onlineBanking: true,
      accountType: "Savings Account",
      accountNumber: "1066747312",
      accountBalance: 25000,
      role: "user",
      loans: [],
      notifications: []
    },
    {
      id: "8018",
      isTransferEnabled: true,
      fullName: "Emily Johnson",
      dob: "1992-11-22",
      ssn: "33333333333",
      email: "emily.j@email.com",
      phone: "5559876543",
      address: "456 Oak Ave, Los Angeles, CA",
      employment: "self-employed",
      income: "120000",
      employerName: "Self",
      initialDeposit: 1000,
      debitCard: true,
      onlineBanking: true,
      accountType: "Checking Account",
      accountNumber: "1066747313",
      accountBalance: 50000,
      role: "user",
      loans: [],
      notifications: []
    },
    {
      id: "8019",
      isTransferEnabled: true,
      fullName: "Michael Brown",
      dob: "1988-03-30",
      ssn: "44444444444",
      email: "michael.b@email.com",
      phone: "5554567890",
      address: "789 Pine Rd, Chicago, IL",
      employment: "employed",
      income: "90000",
      employerName: "XYZ Inc",
      initialDeposit: 750,
      debitCard: true,
      onlineBanking: true,
      accountType: "Premium Account",
      accountNumber: "1066747314",
      accountBalance: 75000,
      role: "user",
      loans: [],
      notifications: []
    }
  ],
  transactions: [
    {
      id: "txn001",
      fromUserId: "8016",
      fromUserName: "Jane Doe",
      toUserId: "8017",
      toUserName: "John Smith",
      amount: 100,
      date: "2025-10-01T02:15:03.474Z",
      balanceAfterSender: 9930.999999999996,
      balanceAfterReceiver: 25100,
      reversed: false
    },
    {
      id: "txn002",
      fromUserId: "8017",
      fromUserName: "John Smith",
      toUserId: "8016",
      toUserName: "Jane Doe",
      amount: 500,
      date: "2025-09-29T01:59:54.619Z",
      balanceAfterSender: 24500,
      balanceAfterReceiver: 10030.999999999996,
      reversed: false
    },
    {
      id: "txn003",
      fromUserId: "8018",
      fromUserName: "Emily Johnson",
      toUserId: "8019",
      toUserName: "Michael Brown",
      amount: 1000,
      date: "2025-09-28T10:30:00.000Z",
      balanceAfterSender: 49000,
      balanceAfterReceiver: 76000,
      reversed: false
    }
  ],
  onlineAccessUsers: [
    {
      id: "oa001",
      userId: "8016",
      username: "janedoe123",
      password: "hashed_password_here",
      securityQuestion: "What is your mother's maiden name?",
      securityAnswer: "Smith",
      lastLogin: "2025-10-01T02:00:00.000Z",
      loginAttempts: 0,
      locked: false
    },
    {
      id: "oa002",
      userId: "8017",
      username: "johnsmith",
      password: "hashed_password_here",
      securityQuestion: "What is your pet's name?",
      securityAnswer: "Buddy",
      lastLogin: "2025-09-30T15:30:00.000Z",
      loginAttempts: 0,
      locked: false
    },
    {
      id: "oa003",
      userId: "8018",
      username: "emilyj",
      password: "hashed_password_here",
      securityQuestion: "What city were you born in?",
      securityAnswer: "Boston",
      lastLogin: "2025-09-29T09:00:00.000Z",
      loginAttempts: 0,
      locked: false
    },
    {
      id: "oa004",
      userId: "8019",
      username: "michaelb",
      password: "hashed_password_here",
      securityQuestion: "What is your favorite movie?",
      securityAnswer: "Inception",
      lastLogin: "2025-09-28T18:45:00.000Z",
      loginAttempts: 0,
      locked: false
    },
    {
      id: "oa005",
      userId: "8020",
      username: "admin",
      password: "hashed_admin_password",
      securityQuestion: "What is the admin keyword?",
      securityAnswer: "admin123",
      lastLogin: "2025-10-01T08:00:00.000Z",
      loginAttempts: 0,
      locked: false
    }
  ],
  accountTypes: [
    {
      id: "acc001",
      name: "Basic Checking",
      description: "A simple checking account with essential features",
      minimumDeposit: 100,
      monthlyFee: 5,
      interestRate: 0,
      features: ["Debit Card", "Online Banking", "Mobile App"],
      transactions: "Unlimited",
      overdraft: 200
    },
    {
      id: "acc002",
      name: "Premium Checking",
      description: "Enhanced checking with bonus benefits",
      minimumDeposit: 500,
      monthlyFee: 15,
      interestRate: 0.5,
      features: ["Debit Card", "Online Banking", "Mobile App", "Cash Back"],
      transactions: "Unlimited",
      overdraft: 500
    },
    {
      id: "acc003",
      name: "Standard Savings",
      description: "Basic savings account to grow your money",
      minimumDeposit: 50,
      monthlyFee: 0,
      interestRate: 1.5,
      features: ["Online Banking", "Mobile App", "Direct Deposit"],
      transactions: "6 per month",
      overdraft: 0
    },
    {
      id: "acc004",
      name: "High-Yield Savings",
      description: "Maximize your savings with competitive rates",
      minimumDeposit: 1000,
      monthlyFee: 0,
      interestRate: 4.5,
      features: ["Online Banking", "Mobile App", "Automatic Savings"],
      transactions: "6 per month",
      overdraft: 0
    },
    {
      id: "acc005",
      name: "Student Checking",
      description: "Checking account designed for students",
      minimumDeposit: 0,
      monthlyFee: 0,
      interestRate: 0,
      features: ["Debit Card", "Online Banking", "Mobile App"],
      transactions: "Unlimited",
      overdraft: 100
    },
    {
      id: "acc006",
      name: "Senior Checking",
      description: "Tailored checking for seniors 65+",
      minimumDeposit: 100,
      monthlyFee: 0,
      interestRate: 0.25,
      features: ["Debit Card", "Online Banking", "Mobile App", "Free Checks"],
      transactions: "Unlimited",
      overdraft: 300
    },
    {
      id: "acc007",
      name: "Business Checking",
      description: "Checking account for business owners",
      minimumDeposit: 500,
      monthlyFee: 25,
      interestRate: 0,
      features: ["Debit Card", "Online Banking", "Merchant Services"],
      transactions: "Unlimited",
      overdraft: 1000
    },
    {
      id: "acc008",
      name: "Business Savings",
      description: "Grow your business funds",
      minimumDeposit: 500,
      monthlyFee: 10,
      interestRate: 2.0,
      features: ["Online Banking", "Mobile App", "Wire Transfers"],
      transactions: "12 per month",
      overdraft: 0
    },
    {
      id: "acc009",
      name: "Money Market",
      description: "Higher rates with check-writing privileges",
      minimumDeposit: 2500,
      monthlyFee: 15,
      interestRate: 3.5,
      features: ["Debit Card", "Online Banking", "Check Writing"],
      transactions: "6 per month",
      overdraft: 0
    },
    {
      id: "acc010",
      name: "Certificate of Deposit",
      description: "Lock in rates with fixed terms",
      minimumDeposit: 1000,
      monthlyFee: 0,
      interestRate: 5.0,
      features: ["Fixed Rate", "FDIC Insured"],
      transactions: "At maturity",
      overdraft: 0
    },
    {
      id: "acc011",
      name: "IRA Savings",
      description: "Individual Retirement Account",
      minimumDeposit: 100,
      monthlyFee: 0,
      interestRate: 4.0,
      features: ["Tax Advantages", "Online Banking"],
      transactions: "6 per month",
      overdraft: 0
    },
    {
      id: "acc012",
      name: "Roth IRA",
      description: "Tax-free growth retirement account",
      minimumDeposit: 100,
      monthlyFee: 0,
      interestRate: 4.0,
      features: ["Tax-Free Withdrawals", "Online Banking"],
      transactions: "6 per month",
      overdraft: 0
    },
    {
      id: "acc013",
      name: "Joint Checking",
      description: "Shared checking account for couples",
      minimumDeposit: 100,
      monthlyFee: 8,
      interestRate: 0,
      features: ["Debit Card", "Online Banking", "Mobile App"],
      transactions: "Unlimited",
      overdraft: 250
    },
    {
      id: "acc014",
      name: "Joint Savings",
      description: "Shared savings account for couples",
      minimumDeposit: 50,
      monthlyFee: 0,
      interestRate: 1.5,
      features: ["Online Banking", "Mobile App"],
      transactions: "6 per month",
      overdraft: 0
    },
    {
      id: "acc015",
      name: "Travel Rewards",
      description: "Earn travel rewards on every purchase",
      minimumDeposit: 500,
      monthlyFee: 95,
      interestRate: 0,
      features: ["Travel Points", "No Foreign Fees", "Airport Lounge"],
      transactions: "Unlimited",
      overdraft: 500
    },
    {
      id: "acc016",
      name: "Basic Credit Card",
      description: "Simple credit card for everyday purchases",
      minimumDeposit: 0,
      monthlyFee: 0,
      interestRate: 18.99,
      features: ["No Annual Fee", "Online Banking", "Fraud Protection"],
      transactions: "Unlimited",
      overdraft: 0
    },
    {
      id: "acc017",
      name: "Cash Back Credit Card",
      description: "Earn cash back on all purchases",
      minimumDeposit: 0,
      monthlyFee: 25,
      interestRate: 16.99,
      features: ["3% Cash Back", "No Foreign Fees", "Travel Insurance"],
      transactions: "Unlimited",
      overdraft: 0
    },
    {
      id: "acc018",
      name: "Platinum Credit Card",
      description: "Premium credit card with exclusive benefits",
      minimumDeposit: 0,
      monthlyFee: 150,
      interestRate: 14.99,
      features: ["5% Points", "Concierge Service", "Airport Lounge Access"],
      transactions: "Unlimited",
      overdraft: 0
    },
    {
      id: "acc019",
      name: "Secured Credit Card",
      description: "Build or rebuild your credit score",
      minimumDeposit: 200,
      monthlyFee: 10,
      interestRate: 24.99,
      features: ["No Credit Check", "Credit Building", "Online Banking"],
      transactions: "Unlimited",
      overdraft: 0
    },
    {
      id: "acc020",
      name: "Business Credit Card",
      description: "Credit card designed for business expenses",
      minimumDeposit: 0,
      monthlyFee: 50,
      interestRate: 17.99,
      features: ["Employee Cards", "Expense Tracking", "Cash Flow Management"],
      transactions: "Unlimited",
      overdraft: 0
    }
  ],
  loans: [
    {
      id: "loan001",
      userId: "8016",
      loanType: "Personal Loan",
      amount: 10000,
      interestRate: 8.5,
      term: 36,
      monthlyPayment: 314.50,
      status: "approved",
      applicationDate: "2025-08-15T10:00:00.000Z",
      approvalDate: "2025-08-16T14:30:00.000Z",
      startDate: "2025-08-17T00:00:00.000Z",
      endDate: "2028-08-17T00:00:00.000Z",
      balance: 8500,
      payments: []
    },
    {
      id: "loan002",
      userId: "8017",
      loanType: "Auto Loan",
      amount: 25000,
      interestRate: 5.9,
      term: 60,
      monthlyPayment: 478.50,
      status: "approved",
      applicationDate: "2025-07-10T09:00:00.000Z",
      approvalDate: "2025-07-11T11:00:00.000Z",
      startDate: "2025-07-12T00:00:00.000Z",
      endDate: "2030-07-12T00:00:00.000Z",
      balance: 22000,
      payments: []
    },
    {
      id: "loan003",
      userId: "8018",
      loanType: "Home Equity",
      amount: 50000,
      interestRate: 7.2,
      term: 120,
      monthlyPayment: 585.00,
      status: "approved",
      applicationDate: "2025-06-20T08:00:00.000Z",
      approvalDate: "2025-06-22T10:00:00.000Z",
      startDate: "2025-06-23T00:00:00.000Z",
      endDate: "2035-06-23T00:00:00.000Z",
      balance: 45000,
      payments: []
    },
    {
      id: "loan004",
      userId: "8019",
      loanType: "Personal Loan",
      amount: 15000,
      interestRate: 9.5,
      term: 48,
      monthlyPayment: 375.00,
      status: "pending",
      applicationDate: "2025-09-25T14:00:00.000Z",
      approvalDate: null,
      startDate: null,
      endDate: null,
      balance: 15000,
      payments: []
    },
    {
      id: "loan005",
      userId: "8016",
      loanType: "Credit Card",
      amount: 5000,
      interestRate: 19.9,
      term: 0,
      monthlyPayment: 150.00,
      status: "approved",
      applicationDate: "2025-05-01T10:00:00.000Z",
      approvalDate: "2025-05-02T09:00:00.000Z",
      startDate: "2025-05-03T00:00:00.000Z",
      endDate: null,
      balance: 3500,
      payments: []
    },
    {
      id: "loan006",
      userId: "8017",
      loanType: "Student Loan",
      amount: 30000,
      interestRate: 4.5,
      term: 120,
      monthlyPayment: 310.00,
      status: "approved",
      applicationDate: "2024-01-15T08:00:00.000Z",
      approvalDate: "2024-01-20T10:00:00.000Z",
      startDate: "2024-02-01T00:00:00.000Z",
      endDate: "2034-02-01T00:00:00.000Z",
      balance: 27000,
      payments: []
    },
    {
      id: "loan007",
      userId: "8018",
      loanType: "Auto Loan",
      amount: 35000,
      interestRate: 6.2,
      term: 72,
      monthlyPayment: 565.00,
      status: "approved",
      applicationDate: "2025-02-10T11:00:00.000Z",
      approvalDate: "2025-02-11T14:00:00.000Z",
      startDate: "2025-02-15T00:00:00.000Z",
      endDate: "2031-02-15T00:00:00.000Z",
      balance: 30000,
      payments: []
    },
    {
      id: "loan008",
      userId: "8019",
      loanType: "Home Improvement",
      amount: 25000,
      interestRate: 7.8,
      term: 84,
      monthlyPayment: 395.00,
      status: "rejected",
      applicationDate: "2025-09-01T09:00:00.000Z",
      approvalDate: "2025-09-05T11:00:00.000Z",
      startDate: null,
      endDate: null,
      balance: 0,
      payments: [],
      rejectionReason: "Credit score below minimum requirement"
    }
  ]
};

// Initialize data file if it doesn't exist
const initializeData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    console.log('Database file initialized');
  }
};

// Read data from file
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is corrupted, initialize with default
    initializeData();
    return defaultData;
  }
};

// Write data to file
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
};

// Initialize on module load
initializeData();

module.exports = {
  readData,
  writeData,
  defaultData,
  initializeData
};
