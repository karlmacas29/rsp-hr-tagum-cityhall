// Backend API routes for OTP and CAPTCHA verification
import express from 'express';
import nodemailer from 'nodemailer';
import axios from 'axios';
import crypto from 'crypto';

const router = express.Router();

// In-memory store for OTPs (use Redis in production)
const otpStore = new Map();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Generate 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiration (5 minutes)
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
    });

    // Send email
    await transporter.sendMail({
      from: `"Tagum City HRMO" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your OTP for Recruitment Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">Tagum City HRMO</h2>
          <h3>Your One-Time Password</h3>
          <p>Your OTP for accessing the Recruitment, Selection and Placement portal is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            City of Tagum Human Resource Management Office<br>
            Recruitment, Selection and Placement
          </p>
        </div>
      `,
    });

    res.status(200).json({
      message: 'OTP sent successfully',
      expiresIn: 300, // 5 minutes in seconds
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    // Check if OTP expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts limit
    if (storedData.attempts >= 3) {
      otpStore.delete(email);
      return res
        .status(400)
        .json({ message: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts++;
      return res.status(400).json({
        message: 'Invalid OTP',
        attemptsLeft: 3 - storedData.attempts,
      });
    }

    // OTP verified successfully
    otpStore.delete(email);

    // Create session or JWT token here
    const token = generateSessionToken(email);

    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      email,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP. Please try again.' });
  }
});

// Verify reCAPTCHA endpoint
router.post('/verify-captcha', async (req, res) => {
  try {
    const { recaptchaResponse } = req.body;

    if (!recaptchaResponse) {
      return res.status(400).json({ message: 'reCAPTCHA response is required' });
    }

    // Verify with Google reCAPTCHA
    const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await axios.post(verificationURL, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaResponse,
      },
    });

    if (!response.data.success) {
      return res.status(400).json({
        message: 'reCAPTCHA verification failed',
        errors: response.data['error-codes'],
      });
    }

    // Check score for v3 (if using reCAPTCHA v3)
    if (response.data.score && response.data.score < 0.5) {
      return res.status(400).json({ message: 'reCAPTCHA score too low' });
    }

    res.status(200).json({
      message: 'reCAPTCHA verified successfully',
      score: response.data.score,
    });
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    res.status(500).json({ message: 'Failed to verify reCAPTCHA. Please try again.' });
  }
});

// Helper function to generate session token (use JWT in production)
function generateSessionToken(email) {
  // This is a simple example - use proper JWT library in production
  return Buffer.from(`${email}:${Date.now()}`).toString('base64');
}

// Cleanup expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
}, 60000); // Clean up every minute

export default router;
