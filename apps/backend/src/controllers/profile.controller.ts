import { Request, Response } from "express";
import { User } from "../models/User.js";
import {
  processImage,
  validateImageDimensions,
} from "../utils/imageProcessor.js";
import {
  getFileUrl,
  deleteFile,
  getFilenameFromUrl,
} from "../utils/fileUpload.js";
import { PHOTO_CONSTRAINTS } from "../constants/profile.js";
import path from "path";

// Get current user's profile
export const getMyProfile = async (
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
        profile: {
          id: user._id,
          email: user.email,
          mobile: user.mobile,
          firstName: user.firstName,
          lastName: user.lastName,
          photos: user.photos,
          bio: user.bio,
          dateOfBirth: user.dateOfBirth,
          age: user.age,
          gender: user.gender,
          homeCity: user.homeCity,
          nationality: user.nationality,
          languages: user.languages,
          travelInterests: user.travelInterests,
          travelStyle: user.travelStyle,
          isProfileComplete: user.isProfileComplete,
          profileCompletionPercentage: user.profileCompletionPercentage,
          authProvider: user.authProvider,
          isEmailVerified: user.isEmailVerified,
          isMobileVerified: user.isMobileVerified,
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

// Update profile information
export const updateProfile = async (
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

    const {
      firstName,
      lastName,
      bio,
      dateOfBirth,
      age,
      gender,
      homeCity,
      nationality,
      languages,
      travelInterests,
      travelStyle,
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Update fields if provided
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (dateOfBirth !== undefined) user.dateOfBirth = new Date(dateOfBirth);
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (homeCity !== undefined) user.homeCity = homeCity;
    if (nationality !== undefined) user.nationality = nationality;
    if (languages !== undefined) user.languages = languages;
    if (travelInterests !== undefined) user.travelInterests = travelInterests;
    if (travelStyle !== undefined) user.travelStyle = travelStyle;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        profile: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          dateOfBirth: user.dateOfBirth,
          age: user.age,
          gender: user.gender,
          homeCity: user.homeCity,
          nationality: user.nationality,
          languages: user.languages,
          travelInterests: user.travelInterests,
          travelStyle: user.travelStyle,
          isProfileComplete: user.isProfileComplete,
          profileCompletionPercentage: user.profileCompletionPercentage,
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// Upload profile photos
export const uploadPhotos = async (
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

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "No files uploaded",
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

    // Check total photos limit
    const totalPhotos = user.photos.length + files.length;
    if (totalPhotos > PHOTO_CONSTRAINTS.MAX_PHOTOS) {
      // Clean up uploaded files
      files.forEach((file) => deleteFile(file.path));
      res.status(400).json({
        success: false,
        message: `Maximum ${PHOTO_CONSTRAINTS.MAX_PHOTOS} photos allowed. You have ${user.photos.length} photos.`,
      });
      return;
    }

    const processedPhotos: string[] = [];

    // Process each uploaded file
    for (const file of files) {
      try {
        // Validate image dimensions
        const isValid = await validateImageDimensions(file.path, 400, 400);
        if (!isValid) {
          deleteFile(file.path);
          continue;
        }

        // Process image
        await processImage({
          inputPath: file.path,
        });

        // Get file URL
        const photoUrl = getFileUrl(file.filename);
        processedPhotos.push(photoUrl);
      } catch (error) {
        console.error("Error processing photo:", error);
        deleteFile(file.path);
      }
    }

    if (processedPhotos.length === 0) {
      res.status(400).json({
        success: false,
        message: "No valid photos to upload",
      });
      return;
    }

    // Add photos to user profile
    user.photos = [...user.photos, ...processedPhotos];
    await user.save();

    res.json({
      success: true,
      message: `${processedPhotos.length} photo(s) uploaded successfully`,
      data: {
        photos: user.photos,
        uploadedPhotos: processedPhotos,
      },
    });
  } catch (error) {
    console.error("Upload photos error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload photos",
    });
  }
};

// Delete a photo
export const deletePhoto = async (
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

    const { photoUrl } = req.body;
    if (!photoUrl) {
      res.status(400).json({
        success: false,
        message: "Photo URL is required",
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

    // Check if photo exists in user's photos
    const photoIndex = user.photos.indexOf(photoUrl);
    if (photoIndex === -1) {
      res.status(404).json({
        success: false,
        message: "Photo not found in profile",
      });
      return;
    }

    // Remove photo from array
    user.photos.splice(photoIndex, 1);

    // Check minimum photos requirement if profile is complete
    if (
      user.isProfileComplete &&
      user.photos.length < PHOTO_CONSTRAINTS.MIN_PHOTOS
    ) {
      res.status(400).json({
        success: false,
        message: `Cannot delete photo. Minimum ${PHOTO_CONSTRAINTS.MIN_PHOTOS} photos required for complete profile.`,
      });
      return;
    }

    await user.save();

    // Delete file from filesystem
    const filename = getFilenameFromUrl(photoUrl);
    if (filename) {
      const filePath = path.join("uploads/profiles", filename);
      deleteFile(filePath);
    }

    res.json({
      success: true,
      message: "Photo deleted successfully",
      data: {
        photos: user.photos,
      },
    });
  } catch (error) {
    console.error("Delete photo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete photo",
    });
  }
};

// Reorder photos
export const reorderPhotos = async (
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

    const { photoUrls } = req.body;
    if (!Array.isArray(photoUrls)) {
      res.status(400).json({
        success: false,
        message: "photoUrls must be an array",
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

    // Verify all URLs belong to user
    const allUrlsValid = photoUrls.every((url) => user.photos.includes(url));
    if (!allUrlsValid || photoUrls.length !== user.photos.length) {
      res.status(400).json({
        success: false,
        message: "Invalid photo URLs provided",
      });
      return;
    }

    user.photos = photoUrls;
    await user.save();

    res.json({
      success: true,
      message: "Photos reordered successfully",
      data: {
        photos: user.photos,
      },
    });
  } catch (error) {
    console.error("Reorder photos error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reorder photos",
    });
  }
};

// Get profile by user ID (for viewing other users)
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Only return public profile information
    res.json({
      success: true,
      data: {
        profile: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          photos: user.photos,
          bio: user.bio,
          age: user.age,
          gender: user.gender,
          homeCity: user.homeCity,
          nationality: user.nationality,
          languages: user.languages,
          travelInterests: user.travelInterests,
          travelStyle: user.travelStyle,
        },
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

// Check profile completion status
export const checkProfileCompletion = async (
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

    const missingFields: string[] = [];

    if (user.photos.length < PHOTO_CONSTRAINTS.MIN_PHOTOS) {
      missingFields.push(`photos (minimum ${PHOTO_CONSTRAINTS.MIN_PHOTOS})`);
    }
    if (!user.bio || user.bio.length < 20) {
      missingFields.push("bio (minimum 20 characters)");
    }
    if (!user.dateOfBirth && !user.age) {
      missingFields.push("age or date of birth");
    }
    if (!user.gender) {
      missingFields.push("gender");
    }
    if (!user.homeCity) {
      missingFields.push("home city");
    }
    if (!user.nationality) {
      missingFields.push("nationality");
    }
    if (!user.languages || user.languages.length === 0) {
      missingFields.push("languages");
    }
    if (!user.travelInterests || user.travelInterests.length === 0) {
      missingFields.push("travel interests");
    }
    if (!user.travelStyle) {
      missingFields.push("travel style");
    }
    if (!user.firstName || !user.lastName) {
      missingFields.push("name");
    }

    res.json({
      success: true,
      data: {
        isComplete: user.isProfileComplete,
        completionPercentage: user.profileCompletionPercentage,
        missingFields,
      },
    });
  } catch (error) {
    console.error("Check profile completion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check profile completion",
    });
  }
};
