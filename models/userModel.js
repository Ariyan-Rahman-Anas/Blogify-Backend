import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      minLength: [4, "Name should have at least 3 character"],
      maxLength: [30, "Name can't exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minLength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationOTP: String,
    verificationOTPExpiresAt: Date,
    refreshToken: String,
    refreshTokenExpiresAt: Date
  },
  { timestamps: true, versionKey: false }
);

export const UserModel = mongoose.model("User", userSchema);