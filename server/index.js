require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 10000;

// Store OTPs temporarily in memory (for demo purposes)
let otpStore = {}; // { email: { otp: '123456', expires: Date.now() + 5*60*1000 } }

// Test endpoint
app.get('/', (req, res) => {
  res.send('OTP backend running');
});

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP with expiration (5 min)
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'blexedsinner@gmail.com',   // your Gmail
      pass: 'jqrndpjrajadmhxk',        // your app password
    },
  });

  const mailOptions = {
    from: 'blexedsinner@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: 'Email and OTP are required' });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: 'OTP not found' });
  if (record.expires < Date.now()) return res.status(400).json({ message: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  // OTP is valid, remove from store
  delete otpStore[email];
  res.json({ message: 'OTP verified successfully' });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
