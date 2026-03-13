require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 7000;
let otpStore = {};

// Brand configuration
const BRAND_NAME = 'Windforest Capital';
const OTP_VALIDITY_MINUTES = 5;
const OTP_VALIDITY_MS = OTP_VALIDITY_MINUTES * 60 * 1000;

// Helper function to escape HTML special characters
const escapeHtml = (text) => {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(text).replace(/[&<>"']/g, (char) => htmlEscapes[char]);
};

// Email template generator
const generateOtpEmailHtml = (otp) => {
  const safeOtp = escapeHtml(otp);
  const expiryText = `${OTP_VALIDITY_MINUTES} minute${OTP_VALIDITY_MINUTES > 1 ? 's' : ''}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code - ${BRAND_NAME}</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: #1a5f7a;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 30px 20px;
      color: #333333;
    }
    .otp-code {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 4px;
      text-align: center;
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 8px;
      margin: 20px 0;
      color: #1a5f7a;
    }
    .email-footer {
      background-color: #f5f5f5;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
    .warning-text {
      color: #d32f2f;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>${BRAND_NAME}</h1>
    </div>
    <div class="email-body">
      <p>Your one-time password (OTP) code is:</p>
      <div class="otp-code">${safeOtp}</div>
      <p>This code is valid for <strong>${expiryText}</strong>.</p>
      <p class="warning-text">Please do not share this code with anyone. ${BRAND_NAME} will never ask for your OTP.</p>
    </div>
    <div class="email-footer">
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
};

// Login notification email template
const generateLoginNotificationHtml = (loginTime, ipAddress, deviceInfo) => {
  const formattedTime = new Date(loginTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Login Detected - ${BRAND_NAME}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .email-header { background: linear-gradient(135deg, #1a5f7a 0%, #2d8aa8 100%); color: #ffffff; padding: 30px; text-align: center; }
    .email-header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .email-body { padding: 40px 30px; color: #334155; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #1e293b; }
    .alert-box { background-color: #f0f9ff; border-left: 4px solid #1a5f7a; padding: 20px; margin: 25px 0; border-radius: 4px; }
    .alert-title { font-weight: 600; color: #1a5f7a; margin-bottom: 10px; font-size: 16px; }
    .info-table { width: 100%; margin: 20px 0; border-collapse: collapse; }
    .info-table td { padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .info-label { font-weight: 600; color: #64748b; width: 40%; }
    .info-value { color: #1e293b; }
    .security-notice { background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-top: 25px; }
    .security-notice p { margin: 8px 0; font-size: 14px; color: #991b1b; }
    .button-container { text-align: center; margin-top: 30px; }
    .button { display: inline-block; padding: 12px 30px; background-color: #1a5f7a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; }
    .email-footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header"><h1>${BRAND_NAME}</h1></div>
    <div class="email-body">
      <p class="greeting">Dear Valued Customer,</p>
      <p>We detected a new login to your <strong>${BRAND_NAME}</strong> account.</p>
      <div class="alert-box">
        <div class="alert-title">✓ Login Successful</div>
        <p>If this was you, no action is required.</p>
      </div>
      <table class="info-table">
        <tr><td class="info-label">Date & Time</td><td class="info-value">${formattedTime}</td></tr>
        <tr><td class="info-label">Device</td><td class="info-value">${escapeHtml(deviceInfo || 'Unknown Device')}</td></tr>
        <tr><td class="info-label">IP Address</td><td class="info-value">${escapeHtml(ipAddress || 'Unknown')}</td></tr>
      </table>
      <div class="security-notice">
        <p><strong>⚠️ Didn't authorize this login?</strong></p>
        <p>If you did not sign in from this device, please secure your account immediately:</p>
        <p>• Change your password</p>
        <p>• Contact our support team</p>
        <p>• Review recent account activity</p>
      </div>
      <div class="button-container"><a href="https://windforest.capital/forgot-password" class="button">Secure Your Account</a></div>
    </div>
    <div class="email-footer">
      <p>This is an automated message from <strong>${BRAND_NAME}</strong>.</p>
      <p>Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>`;
};

// Send login notification email
const sendLoginNotification = async (email, loginTime, ipAddress, deviceInfo) => {
  try {
    const info = await transporter.sendMail({
      from: `"${BRAND_NAME}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `🔐 New Login to Your ${BRAND_NAME} Account`,
      text: `Dear Valued Customer,\n\nWe detected a new login to your ${BRAND_NAME} account.\n\nLogin Time: ${new Date(loginTime).toLocaleString()}\nDevice: ${deviceInfo || 'Unknown'}\nIP Address: ${ipAddress || 'Unknown'}\n\nIf this was you, no action is required.\nIf you did not authorize this login, please secure your account immediately.\n\nBest regards,\n${BRAND_NAME}`,
      html: generateLoginNotificationHtml(loginTime, ipAddress, deviceInfo),
    });
    console.log('Login notification email sent:', info.messageId);
    return true;
  } catch (err) {
    console.error('Login notification error:', err);
    return false;
  }
};

// Transfer notification email template - dynamic for sender and receiver
const generateTransferNotificationHtml = (data) => {
  const {
    type, // 'sender' or 'receiver'
    amount,
    senderName,
    receiverName,
    beneficiaryName,
    accountNumber,
    transferDate,
    referenceNumber
  } = data;

  const isSender = type === 'sender';
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  const formattedDate = transferDate 
    ? new Date(transferDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

  const actionText = isSender 
    ? `You sent a transfer of <strong>${formattedAmount}</strong>`
    : `You received a transfer of <strong>${formattedAmount}</strong>`;

  const statusBadge = isSender
    ? '<span style="background-color: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">✓ Sent Successfully</span>'
    : '<span style="background-color: #dbeafe; color: #1e40af; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">✓ Received Successfully</span>';

  const relatedPartyName = isSender ? escapeHtml(receiverName || beneficiaryName || 'N/A') : escapeHtml(senderName || 'N/A');
  const relatedPartyLabel = isSender ? 'Sent To' : 'Received From';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isSender ? 'Transfer Sent' : 'Transfer Received'} - ${BRAND_NAME}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .email-header { background: linear-gradient(135deg, #1a5f7a 0%, #2d8aa8 100%); color: #ffffff; padding: 30px; text-align: center; }
    .email-header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .email-header .subtitle { opacity: 0.9; margin-top: 8px; font-size: 14px; }
    .email-body { padding: 40px 30px; color: #334155; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #1e293b; }
    .status-badge { display: inline-block; margin-bottom: 20px; }
    .amount-box { background-color: #f0f9ff; border: 2px solid #1a5f7a; border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0; }
    .amount-label { font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    .amount-value { font-size: 36px; font-weight: 700; color: #1a5f7a; margin: 10px 0 0 0; }
    .details-card { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .details-title { font-weight: 600; color: #1e293b; margin-bottom: 15px; font-size: 16px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; font-size: 14px; }
    .detail-value { color: #1e293b; font-weight: 600; font-size: 14px; }
    .action-text { font-size: 16px; color: #334155; margin: 20px 0; }
    .button-container { text-align: center; margin-top: 30px; }
    .button { display: inline-block; padding: 12px 30px; background-color: #1a5f7a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; }
    .email-footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
    .help-section { background-color: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 20px; margin-top: 25px; }
    .help-title { font-weight: 600; color: #854d0e; margin-bottom: 10px; }
    .help-text { font-size: 14px; color: #854d0e; margin: 0; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>${BRAND_NAME}</h1>
      <div class="subtitle">${isSender ? 'Money Transfer Confirmation' : 'Incoming Transfer Notification'}</div>
    </div>
    <div class="email-body">
      <p class="greeting">Dear Valued Customer,</p>
      
      <div class="status-badge">${statusBadge}</div>
      
      <p class="action-text">${actionText}</p>
      
      <div class="amount-box">
        <div class="amount-label">${isSender ? 'Amount Sent' : 'Amount Received'}</div>
        <p class="amount-value">${formattedAmount}</p>
      </div>
      
      <div class="details-card">
        <div class="details-title">Transaction Details</div>
        <div class="detail-row">
          <span class="detail-label">${relatedPartyLabel}</span>
          <span class="detail-value">${relatedPartyName}</span>
        </div>
        ${accountNumber ? `
        <div class="detail-row">
          <span class="detail-label">Account Number</span>
          <span class="detail-value">****${escapeHtml(accountNumber.slice(-4))}</span>
        </div>
        ` : ''}
        <div class="detail-row">
          <span class="detail-label">Date & Time</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        ${referenceNumber ? `
        <div class="detail-row">
          <span class="detail-label">Reference Number</span>
          <span class="detail-value">${escapeHtml(referenceNumber)}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="help-section">
        <div class="help-title">Questions about this transfer?</div>
        <p class="help-text">If you did not authorize this transfer or notice any discrepancies, please contact our support team immediately.</p>
      </div>
      
      <div class="button-container">
        <a href="https://windforest.capital/transactions" class="button">View Transaction History</a>
      </div>
    </div>
    <div class="email-footer">
      <p>This is an automated message from <strong>${BRAND_NAME}</strong>.</p>
      <p>Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>`;
};

// Send transfer notification email
const sendTransferNotification = async (email, amount, beneficiaryName, senderName, receiverName, accountNumber, type) => {
  const referenceNumber = `TRF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const emailData = {
    type,
    amount,
    senderName,
    receiverName,
    beneficiaryName,
    accountNumber,
    transferDate: new Date().toISOString(),
    referenceNumber
  };

  const isSender = type === 'sender';
  const subject = isSender 
    ? `✓ Transfer Sent: ${amount.toFixed(2)} - ${BRAND_NAME}`
    : `✓ You Received: ${amount.toFixed(2)} - ${BRAND_NAME}`;

  const textContent = isSender
    ? `Dear Customer,\n\nYou have sent a transfer of ${amount.toFixed(2)} to ${receiverName || beneficiaryName || 'N/A'}.\n\nReference: ${referenceNumber}\nDate: ${new Date().toLocaleString()}\n\nThank you for using ${BRAND_NAME}.`
    : `Dear Customer,\n\nYou have received a transfer of ${amount.toFixed(2)} from ${senderName || 'N/A'}.\n\nReference: ${referenceNumber}\nDate: ${new Date().toLocaleString()}\n\nThank you for using ${BRAND_NAME}.`;

  try {
    const info = await transporter.sendMail({
      from: `"${BRAND_NAME}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      text: textContent,
      html: generateTransferNotificationHtml(emailData),
    });
    console.log('Transfer notification email sent:', info.messageId);
    return true;
  } catch (err) {
    console.error('Transfer notification error:', err);
    return false;
  }
};

const SMTP_PORT = Number(process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  requireTLS: SMTP_PORT === 587,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Test SMTP connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('SMTP verify failed:', error);
  } else {
    console.log('SMTP server is ready');
  }
});

// Base test route: /api
router.get('/', (req, res) => {
  res.send('OTP backend running with your domain SMTP 🚀');
});

// Send OTP: /api/send-otp
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = {
    otp,
    expires: Date.now() + OTP_VALIDITY_MS,
  };

  try {
    const info = await transporter.sendMail({
      from: `"${BRAND_NAME}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your ${BRAND_NAME} OTP code`,
      text: `Your OTP code is: ${otp}. It is valid for ${OTP_VALIDITY_MINUTES} minutes. Please do not share this code with anyone. ${BRAND_NAME} will never ask for it.`,
      html: generateOtpEmailHtml(otp),
    });

    console.log('Email sent:', info.messageId);

    return res.status(200).json({
      message: 'OTP sent successfully',
    });
  } catch (err) {
    console.error('Send mail error:', err);

    return res.status(500).json({
      message: 'Failed to send OTP',
      error: err.message,
    });
  }
});

// Verify OTP: /api/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
  const userAgent = req.headers['user-agent'] || 'Unknown Device';

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ message: 'OTP not found' });
  }

  if (record.expires < Date.now()) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  delete otpStore[email];
  
  // Send login notification email (non-blocking)
  const loginTime = Date.now();
  sendLoginNotification(email, loginTime, ipAddress, userAgent).catch(err => {
    console.error('Failed to send login notification:', err);
  });

  return res.json({ message: 'OTP verified successfully' });
});

// Login confirmation endpoint: /api/login-confirmation
router.post('/login-confirmation', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
  const userAgent = req.headers['user-agent'] || 'Unknown Device';
  const loginTime = Date.now();

  try {
    await sendLoginNotification(email, loginTime, ipAddress, userAgent);
    return res.json({ message: 'Login notification sent successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send login notification', error: err.message });
  }
});

router.post('/send-transfer-notification', async (req, res) => {
  const { email, amount, beneficiaryName, senderName, receiverName, accountNumber, type } = req.body;

  // type: 'sender' or 'receiver'
  if (!email || !amount) {
    return res.status(400).json({ message: 'Email and amount are required' });
  }

  try {
    await sendTransferNotification(email, amount, beneficiaryName, senderName, receiverName, accountNumber, type);
    return res.json({ message: 'Transfer notification sent successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send transfer notification', error: err.message });
  }
});

// Mount everything under /api
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});