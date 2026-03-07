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
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

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
  return res.json({ message: 'OTP verified successfully' });
});

// Mount everything under /api
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});