import multer from "multer";
import path from "path";
import fs from "fs";
import { PHOTO_CONSTRAINTS } from "../constants/profile.js";

// Ensure uploads directory exists
const uploadDir = "uploads/profiles";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${ext}`);
  },
});

// File filter to accept only images
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (PHOTO_CONSTRAINTS.ALLOWED_FORMATS.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed types: ${PHOTO_CONSTRAINTS.ALLOWED_FORMATS.join(", ")}`
      )
    );
  }
};

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: PHOTO_CONSTRAINTS.MAX_FILE_SIZE,
  },
});

// Helper function to delete a file
export const deleteFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

// Helper function to get file URL
export const getFileUrl = (filename: string): string => {
  const baseUrl = process.env.BASE_URL || "http://localhost:8000";
  return `${baseUrl}/uploads/profiles/${filename}`;
};

// Helper function to extract filename from URL
export const getFilenameFromUrl = (url: string): string | null => {
  try {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1] || null;
  } catch {
    return null;
  }
};
