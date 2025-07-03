import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User schema for authentication and verification
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // User's full name is required
    trim: true, // Removes extra spaces
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // No two users can register with the same email
    lowercase: true, // Normalize email for consistency
  },
  password: {
    type: String,
    required: true, // Hashed password will be stored here
  },
  isVerified: {
    type: Boolean,
    default: false, // Flag to check if user has verified their email
  },
  otp: String, // Stores OTP for email verification or password reset
  otpExpires: Date, // Expiry time for the OTP
});

// Export the User model
const User = mongoose.model("User", userSchema);
export default User;
