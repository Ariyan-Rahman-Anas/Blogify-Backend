import { UserModel } from "../models/userModel.js";
import { generateJWT } from "../utils/generateJWT.js";
import { errorHandler, successHandler } from "../utils/responseHandler.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

//create user
export const signUp = async (req, res) => {
  try {
    //asking for necessary fields
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return errorHandler(
        res,
        "Missing required fields",
        { missingFields: ["name", "email", "password"] },
        400
      );
    }

    //checking user already exist or not
    const userAlreadyExist = await UserModel.findOne({ email });
    if (userAlreadyExist) {
      return errorHandler(
        res,
        "User already exist with this email",
        { email },
        409
      );
    }

    // Validate password length manually
    if (password.length < 6) {
      return errorHandler(
        res,
        "Password must be at least 6 characters long",
        { passwordLength: password.length },
        400
      );
    }

    //hashing password and creating account verification OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    //creating account and storing data in the DB
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      verificationOTP,
      verificationOTPExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    return successHandler(
      res,
      "Registration Successful",
      { userId: newUser._id },
      201
    );
  } catch (error) {
    return errorHandler(
      res,
      "An error occurred during sign-up",
      { error: error.message },
      500
    );
  }
};


//login user
export const signIn = async (req, res) => {
  try {
    // Checking if the user exists
    const { email, password } = req.body;
    const isUserExist = await UserModel.findOne({ email });
    if (!isUserExist) {
      return errorHandler(
        res,
        "User doesn't exist with this email",
        { email },
        404
      );
    }

    // Checking if the password is correct
    const isValidPassword = await bcrypt.compare(
      password,
      isUserExist.password
    );
    if (!isValidPassword) {
      return errorHandler(
        res,
        "Incorrect password",
        { incorrectPassword: password },
        401
      );
    }

    // Setting JWT and logging in
    const { accessToken, refreshToken } = await generateJWT(
      res,
      isUserExist._id
    );

    return successHandler(res, `Welcome back, ${isUserExist.name}`, {
      user: { ...isUserExist._doc, password: undefined },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return errorHandler(
      res,
      "An error occurred during sign-in",
      { error: error.message },
      500
    );
  }
};


export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return errorHandler(res, "No refresh token provided", {}, 403);
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    // Check if user exists and refresh token matches
    const user = await UserModel.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return errorHandler(res, "Invalid refresh token", {}, 403);
    }

    // Generate new access token
    const { accessToken } = await generateJWT(res, user._id);
    return successHandler(res, "Token refreshed successfully", { accessToken });
  } catch (error) {
    return errorHandler(
      res,
      "An error occurred during token refresh",
      { error: error.message },
      500
    );
  }
}


export const resetPassword = async (req, res) => {
  try {
  } catch (error) {}
}


//log out the user
export const signOut = async (req, res) => {
  try {
    const userId = req.user?._id
    if (userId) {
    await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
    
    }
    res.cookie("accessToken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.cookie("refreshToken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    return successHandler(res, "Logged out successfully", {}, 200);
  } catch (error) {
    return errorHandler(
      res,
      "An error occurred during log out",
      { error: error.message },
      500
    ); 
  }
};