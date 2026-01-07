import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { sendWelcomeEmail } from "../utils/email.js";

// Initialize Google OAuth client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Google OAuth Login
export const googleAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({
        success: false,
        message: "ID token is required",
      });
      return;
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).json({
        success: false,
        message: "Invalid Google token",
      });
      return;
    }

    const { sub: googleId, email, given_name, family_name, picture } = payload;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email not provided by Google",
      });
      return;
    }

    // Find or create user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Create new user
      user = await User.create({
        googleId,
        email,
        firstName: given_name,
        lastName: family_name,
        profilePicture: picture,
        authProvider: "google",
        isEmailVerified: true, // Google emails are already verified
      });

      // Send welcome email
      if (given_name) {
        await sendWelcomeEmail(email, given_name);
      }
    } else {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.profilePicture && picture) {
        user.profilePicture = picture;
      }
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
      message: "Google authentication successful",
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
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

// Apple Sign In
export const appleAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { identityToken, user: appleUser } = req.body;

    if (!identityToken) {
      res.status(400).json({
        success: false,
        message: "Identity token is required",
      });
      return;
    }

    // In a production environment, you would verify the Apple identity token here
    // using apple-auth library or similar. For now, we'll implement basic structure.
    
    // TODO: Implement proper Apple token verification
    // For reference: https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api
    
    // Extract user info from the request
    // Note: Apple only provides user details on first sign-in
    const { email, firstName, lastName, appleId } = req.body;

    if (!appleId) {
      res.status(400).json({
        success: false,
        message: "Apple ID is required",
      });
      return;
    }

    // Find or create user
    let user = await User.findOne({ appleId });

    if (!user && email) {
      // Check if user exists with this email
      user = await User.findOne({ email });
      if (user) {
        // Link Apple account to existing user
        user.appleId = appleId;
        user.isEmailVerified = true;
        user.lastLogin = new Date();
        await user.save();
      }
    }

    if (!user) {
      // Create new user
      user = await User.create({
        appleId,
        email: email || undefined,
        firstName: firstName || "User",
        lastName: lastName || "",
        authProvider: "apple",
        isEmailVerified: !!email, // Apple emails are verified
      });

      // Send welcome email if email is provided
      if (email && firstName) {
        await sendWelcomeEmail(email, firstName);
      }
    } else {
      // Update last login
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
      message: "Apple authentication successful",
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
    console.error("Apple auth error:", error);
    res.status(500).json({
      success: false,
      message: "Apple authentication failed",
    });
  }
};
