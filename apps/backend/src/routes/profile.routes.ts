import { Router } from "express";
import { body } from "express-validator";
import {
  getMyProfile,
  updateProfile,
  uploadPhotos,
  deletePhoto,
  reorderPhotos,
  getUserProfile,
  checkProfileCompletion,
} from "../controllers/profile.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { upload } from "../utils/fileUpload.js";
import {
  TRAVEL_INTERESTS,
  LANGUAGES,
  TRAVEL_STYLES,
  GENDERS,
  BIO_MAX_LENGTH,
  AGE_CONSTRAINTS,
} from "../constants/profile.js";

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// Get current user's profile
router.get("/me", getMyProfile);

// Update profile information
router.put(
  "/me",
  validate([
    body("firstName").optional().trim().isLength({ min: 1, max: 50 }),
    body("lastName").optional().trim().isLength({ min: 1, max: 50 }),
    body("bio")
      .optional()
      .trim()
      .isLength({ max: BIO_MAX_LENGTH })
      .withMessage(`Bio must not exceed ${BIO_MAX_LENGTH} characters`),
    body("dateOfBirth")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format")
      .custom((value) => {
        const birthDate = new Date(value);
        const age = Math.floor(
          (Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        );
        if (age < AGE_CONSTRAINTS.MIN_AGE) {
          throw new Error(
            `You must be at least ${AGE_CONSTRAINTS.MIN_AGE} years old`
          );
        }
        if (age > AGE_CONSTRAINTS.MAX_AGE) {
          throw new Error(`Age cannot exceed ${AGE_CONSTRAINTS.MAX_AGE}`);
        }
        return true;
      }),
    body("age")
      .optional()
      .isInt({ min: AGE_CONSTRAINTS.MIN_AGE, max: AGE_CONSTRAINTS.MAX_AGE })
      .withMessage(
        `Age must be between ${AGE_CONSTRAINTS.MIN_AGE} and ${AGE_CONSTRAINTS.MAX_AGE}`
      ),
    body("gender")
      .optional()
      .isIn(GENDERS)
      .withMessage(`Gender must be one of: ${GENDERS.join(", ")}`),
    body("homeCity").optional().trim().isLength({ min: 2, max: 100 }),
    body("nationality").optional().trim().isLength({ min: 2, max: 100 }),
    body("languages")
      .optional()
      .isArray()
      .withMessage("Languages must be an array")
      .custom((value: string[]) => {
        if (value.length > 10) {
          throw new Error("Maximum 10 languages allowed");
        }
        return true;
      }),
    body("travelInterests")
      .optional()
      .isArray()
      .withMessage("Travel interests must be an array")
      .custom((value: string[]) => {
        if (value.length > 15) {
          throw new Error("Maximum 15 travel interests allowed");
        }
        // Validate all interests are valid
        const validInterests = TRAVEL_INTERESTS as readonly string[];
        const allValid = value.every((interest) =>
          validInterests.includes(interest)
        );
        if (!allValid) {
          throw new Error(
            `Invalid travel interest. Valid options: ${TRAVEL_INTERESTS.join(", ")}`
          );
        }
        return true;
      }),
    body("travelStyle")
      .optional()
      .isIn(TRAVEL_STYLES)
      .withMessage(`Travel style must be one of: ${TRAVEL_STYLES.join(", ")}`),
  ]),
  updateProfile
);

// Upload photos (max 8 photos per request)
router.post(
  "/photos",
  upload.array("photos", 8),
  uploadPhotos
);

// Delete a photo
router.delete(
  "/photos",
  validate([
    body("photoUrl")
      .notEmpty()
      .withMessage("Photo URL is required")
      .isURL()
      .withMessage("Invalid photo URL"),
  ]),
  deletePhoto
);

// Reorder photos
router.put(
  "/photos/reorder",
  validate([
    body("photoUrls")
      .isArray()
      .withMessage("photoUrls must be an array")
      .notEmpty()
      .withMessage("photoUrls cannot be empty"),
  ]),
  reorderPhotos
);

// Check profile completion
router.get("/completion", checkProfileCompletion);

// Get another user's profile (public view)
router.get("/:userId", getUserProfile);

export default router;
