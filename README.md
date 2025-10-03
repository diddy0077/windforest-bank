# WindForest Bank

## Description

A comprehensive full-stack banking simulation web application built with React and Express.js. This application provides a complete banking experience including user authentication, account management, money transfers, loan applications, and administrative controls.

## Features

### User Features
- **User Authentication**: Secure signup and login with OTP verification via email
- **Account Management**: Support for multiple account types (Checking, Savings, High-Yield Savings, Business accounts, etc.)
- **Money Transfers**: Internal transfers between users and external transfers to linked accounts
- **Beneficiary Management**: Add, manage, and remove saved beneficiaries for quick transfers
- **Transaction History**: Detailed view of all account transactions with filtering and search
- **Loan Applications**: Apply for various loan types (Personal, Education, Car, Home, Business, etc.) with built-in calculator
- **Loan Dashboard**: Track loan applications, view payment schedules, and manage active loans
- **Profile Management**: Edit personal information, change passwords, update security questions, unlink accounts
- **Account Linking**: Link external accounts with micro-deposit verification
- **Notifications System**: Real-time notifications for transfers, account changes, and system alerts
- **Account Statements**: Generate and download PDF statements with transaction details and loan information
- **Debit Cards**: Virtual card generation with account opening
- **Forgot Password**: Secure password reset with OTP verification

### Account Opening & Enrollment
- **Multi-Step Account Opening**: Comprehensive form with validation, document upload, and receipt generation
- **Online Enrollment**: Step-by-step process for online banking setup
- **Account Types Information**: Detailed comparison of available account types and features

### Admin Features
- **Admin Dashboard**: Comprehensive user management interface
- **User Management**: View, edit, and manage all user accounts
- **Transfer Restrictions**: Ability to restrict/unrestrict user transfer capabilities
- **Transaction Reversals**: Reverse transactions with automatic balance adjustments and notifications
- **User Oversight**: Monitor user activities, balances, and account statuses

### Additional Features
- **Responsive Design**: Fully responsive UI built with Tailwind CSS
- **Animations**: Smooth animations and transitions using Framer Motion
- **Charts & Analytics**: Spending data visualization with Recharts
- **PDF Generation**: Download receipts, statements, and reports
- **Email Notifications**: Automated email notifications for various actions
- **Security Features**: OTP verification, password hashing, session management
- **Data Persistence**: JSON Server for mock data storage and API simulation

## Technologies Used

### Frontend
- **React 19**: Modern React with hooks and concurrent features
- **React Router DOM**: Client-side routing for single-page application
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Framer Motion**: Animation library for smooth UI transitions
- **Lucide React**: Modern icon library
- **React Toastify**: Toast notifications for user feedback
- **Recharts**: Chart library for data visualization
- **jsPDF**: PDF generation for statements and receipts
- **EmailJS**: Email service integration

### Backend
- **Express.js**: Web framework for Node.js
- **JSON Server**: REST API simulation with mock data
- **Resend**: Email service for OTP and notifications
- **Nodemailer**: Email sending capabilities
- **CORS**: Cross-origin resource sharing
- **Body Parser**: Request body parsing middleware
- **Dotenv**: Environment variable management

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd my-bank
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install server dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**:
   Create a `.env` file in the `server` directory with:
   ```
   RESEND_API_KEY=your_resend_api_key
   ```

5. **Start the JSON Server for mock data**:
   ```bash
   npx json-server --watch db.json --port 3001
   ```

6. **Start the backend server**:
   ```bash
   cd server
   npm start
   ```

7. **Start the frontend**:
   In a new terminal, from the root directory:
   ```bash
   npm run dev
   ```

8. **Open your browser** to `http://localhost:5173` (default Vite port).

## Usage

### For Users
- **Register**: Create a new account with personal information and OTP verification
- **Login**: Access your account with username/password and optional OTP
- **Dashboard**: View account balances, recent transactions, and spending analytics
- **Transfers**: Send money to other users or linked external accounts
- **Loans**: Browse loan options, use calculator, and submit applications
- **Profile**: Manage personal information and account settings

### For Admins
- **Admin Login**: Access admin panel with admin credentials
- **User Management**: View all users, restrict transfers, reverse transactions
- **System Monitoring**: Oversee platform activities and user statuses

## Project Structure

```
my-bank/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── assets/            # Static assets
│   └── ...
├── server/                # Backend Express server
│   ├── index.js           # Server entry point
│   └── ...
├── db.json                # Mock data for JSON Server
├── public/                # Static files
└── package.json           # Project dependencies
```

## API Endpoints

### JSON Server Endpoints (Port 3001)
- `GET /users` - Get all users
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `GET /transactions` - Get transactions
- `POST /transactions` - Create transaction
- `GET /accountTypes` - Get account types
- `GET /loans` - Get loan types

### Express Server Endpoints (Port 7000)
- `POST /send-otp` - Send OTP to email
- `POST /verify-otp` - Verify OTP code

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.