import { Request, Response } from "express";
import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, deleteRefreshToken, deleteUserRefreshTokens } from "../utils/jwt.js";
import { createOTP, verifyOTP } from "../utils/otp.js";
import { sendOTPEmail, sendWelcomeEmail } from "../utils/email.js";

// Register with Email and Password
export const registerWithEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      authProvider: "email",
      isEmailVerified: false,
    });

    // Generate OTP for email verification
    const otp = await createOTP(email, "email", "verification");
    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email with the OTP sent.",
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// Login with Email and Password
export const loginWithEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
    });
    const refreshToken = await generateRefreshToken(user._id.toString());

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// Send OTP to Email
export const sendEmailOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const otp = await createOTP(email, "email", "login");
    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// Verify Email OTP and Login
export const verifyEmailOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp, firstName, lastName } = req.body;

    // Verify OTP
    await verifyOTP(email, otp, "email");

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        firstName,
        lastName,
        authProvider: "email",
        isEmailVerified: true,
      });

      // Send welcome email
      if (firstName) {
        await sendWelcomeEmail(email, firstName);
      }
    } else {
      // Update existing user
      user.isEmailVerified = true;
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
    });
    const refreshToken = await generateRefreshToken(user._id.toString());

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "OTP verification failed",
    });
  }
};

// Send OTP to Mobile
export const sendMobileOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { mobile } = req.body;

    const otp = await createOTP(mobile, "mobile", "login");

    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    // For now, we'll just log it (in production, send actual SMS)
    console.log(`SMS OTP for ${mobile}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent to your mobile number",
      // In development, include OTP in response
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  } catch (error) {
    console.error("Send mobile OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// Verify Mobile OTP and Login
export const verifyMobileOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { mobile, otp, firstName, lastName } = req.body;

    // Verify OTP
    await verifyOTP(mobile, otp, "mobile");

    // Find or create user
    let user = await User.findOne({ mobile });

    if (!user) {
      // Create new user
      user = await User.create({
        mobile,
        firstName,
        lastName,
        authProvider: "mobile",
        isMobileVerified: true,
      });
    } else {
      // Update existing user
      user.isMobileVerified = true;
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      mobile: user.mobile,
    });
    const refreshToken = await generateRefreshToken(user._id.toString());

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          mobile: user.mobile,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          isMobileVerified: user.isMobileVerified,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error("Verify mobile OTP error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "OTP verification failed",
    });
  }
};

// Refresh Access Token
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
      return;
    }

    // Verify refresh token
    const decoded = await verifyRefreshToken(refreshToken);

    // Get user details
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      mobile: user.mobile,
    });

    res.json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// Logout from all devices
export const logoutAll = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    await deleteUserRefreshTokens(req.user.userId);

    res.json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// Get current user profile
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          mobile: user.mobile,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          isEmailVerified: user.isEmailVerified,
          isMobileVerified: user.isMobileVerified,
          authProvider: user.authProvider,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};
