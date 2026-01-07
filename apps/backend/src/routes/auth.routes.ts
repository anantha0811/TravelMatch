import { Router } from "express";
import { body } from "express-validator";
import {
  registerWithEmail,
  loginWithEmail,
  sendEmailOTP,
  verifyEmailOTP,
  sendMobileOTP,
  verifyMobileOTP,
  refreshAccessToken,
  logout,
  logoutAll,
  getProfile,
} from "../controllers/auth.controller.js";
import { googleAuth, appleAuth } from "../controllers/oauth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { isStrongPassword } from "../utils/password.js";

const router = Router();

// Email/Password Authentication Routes
router.post(
  "/register/email",
  validate([
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .custom((value) => {
        if (!isStrongPassword(value)) {
          throw new Error(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
          );
        }
        return true;
      }),
    body("firstName").notEmpty().trim().withMessage("First name is required"),
    body("lastName").optional().trim(),
  ]),
  registerWithEmail
);

router.post(
  "/login/email",
  validate([
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  loginWithEmail
);

// Email OTP Authentication Routes
router.post(
  "/otp/email/send",
  validate([
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  ]),
  sendEmailOTP
);

router.post(
  "/otp/email/verify",
  validate([
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
    body("firstName").optional().trim(),
    body("lastName").optional().trim(),
  ]),
  verifyEmailOTP
);

// Mobile OTP Authentication Routes
router.post(
  "/otp/mobile/send",
  validate([
    body("mobile")
      .isMobilePhone()
      .withMessage("Valid mobile number is required"),
  ]),
  sendMobileOTP
);

router.post(
  "/otp/mobile/verify",
  validate([
    body("mobile")
      .isMobilePhone()
      .withMessage("Valid mobile number is required"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
    body("firstName").optional().trim(),
    body("lastName").optional().trim(),
  ]),
  verifyMobileOTP
);

// OAuth Routes
router.post(
  "/oauth/google",
  validate([body("idToken").notEmpty().withMessage("ID token is required")]),
  googleAuth
);

router.post(
  "/oauth/apple",
  validate([
    body("identityToken").notEmpty().withMessage("Identity token is required"),
    body("appleId").notEmpty().withMessage("Apple ID is required"),
    body("email").optional().isEmail().normalizeEmail(),
    body("firstName").optional().trim(),
    body("lastName").optional().trim(),
  ]),
  appleAuth
);

// Token Management Routes
router.post(
  "/refresh",
  validate([
    body("refreshToken").notEmpty().withMessage("Refresh token is required"),
  ]),
  refreshAccessToken
);

router.post("/logout", logout);

// Protected Routes
router.post("/logout/all", authenticate, logoutAll);
router.get("/profile", authenticate, getProfile);

export default router;
