require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 7000;

// Store OTPs temporarily
let otpStore = {};

// Setup Nodemailer transport with your domain SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., mail.yourdomain.com
  port: process.env.SMTP_PORT, // 465 or 587
  secure: process.env.SMTP_PORT == 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER, // full email address
    pass: process.env.SMTP_PASS, // email password
  },
});

// Test endpoint
app.get('/', (req, res) => {
  res.send('OTP backend running with your domain SMTP 🚀');
});

// Send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  try {
    await transporter.sendMail({
      from: `"Your App Name" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP (same as before)
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: 'Email and OTP are required' });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: 'OTP not found' });
  if (record.expires < Date.now()) return res.status(400).json({ message: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  delete otpStore[email];
  res.json({ message: 'OTP verified successfully' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));