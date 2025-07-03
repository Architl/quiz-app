import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Helper to generate a 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ================== REGISTER ==================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    // If user already exists and is verified
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // If user exists but not verified, update info and resend OTP
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.otp = generateOTP();
      existingUser.otpExpires = Date.now() + 10 * 60 * 1000;
      await existingUser.save();

      await sendOTPEmail(existingUser.email, existingUser.otp);

      return res.status(200).json({ message: "OTP resent to your email" });
    }

    // If user is new
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    await user.save();

    await sendOTPEmail(email, otp);

    res.status(201).json({ message: "OTP sent to email." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== SEND OTP EMAIL ==================
const sendOTPEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: toEmail,
    subject: "Verify your email",
    text: `Your verification code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// ================== VERIFY EMAIL ==================
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ error: "Email already verified" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== RESEND OTP ==================
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ error: "Email already verified" });

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send new OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: "Your new OTP",
      text: `Your new OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP resent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== LOGIN ==================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(400).json({ error: "Email not found" });

    if (!foundUser.isVerified) {
      return res
        .status(401)
        .json({
          error: "Email not verified. Please verify before logging in.",
        });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== FORGOT PASSWORD ==================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send reset OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: "Reset your password",
      text: `Your password reset OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== RESET PASSWORD ==================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.password = newPassword; // Will be hashed by pre-save middleware
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== GET PROFILE ==================
export const getProfile = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user).select("-password");
    if (!foundUser) return res.status(404).json({ error: "User not found" });

    res.json(foundUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
