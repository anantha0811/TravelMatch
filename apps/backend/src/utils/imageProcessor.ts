import sharp from "sharp";
import path from "path";
import { PHOTO_CONSTRAINTS } from "../constants/profile.js";

interface ProcessImageOptions {
  inputPath: string;
  outputPath?: string;
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Process and optimize image
 */
export const processImage = async ({
  inputPath,
  outputPath,
  width = PHOTO_CONSTRAINTS.IMAGE_WIDTH,
  height = PHOTO_CONSTRAINTS.IMAGE_HEIGHT,
  quality = 85,
}: ProcessImageOptions): Promise<string> => {
  try {
    const output = outputPath || inputPath;

    await sharp(inputPath)
      .resize(width, height, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality, progressive: true })
      .toFile(output + ".tmp");

    // Replace original with processed image
    const fs = await import("fs");
    fs.default.renameSync(output + ".tmp", output);

    return output;
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image");
  }
};

/**
 * Create thumbnail from image
 */
export const createThumbnail = async (
  inputPath: string,
  outputPath?: string
): Promise<string> => {
  try {
    const output =
      outputPath ||
      inputPath.replace(
        path.extname(inputPath),
        `-thumb${path.extname(inputPath)}`
      );

    await sharp(inputPath)
      .resize(PHOTO_CONSTRAINTS.THUMBNAIL_WIDTH, PHOTO_CONSTRAINTS.THUMBNAIL_HEIGHT, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 80, progressive: true })
      .toFile(output);

    return output;
  } catch (error) {
    console.error("Error creating thumbnail:", error);
    throw new Error("Failed to create thumbnail");
  }
};

/**
 * Get image metadata
 */
export const getImageMetadata = async (
  imagePath: string
): Promise<sharp.Metadata> => {
  try {
    return await sharp(imagePath).metadata();
  } catch (error) {
    console.error("Error reading image metadata:", error);
    throw new Error("Failed to read image metadata");
  }
};

/**
 * Validate image dimensions
 */
export const validateImageDimensions = async (
  imagePath: string,
  minWidth = 400,
  minHeight = 400
): Promise<boolean> => {
  try {
    const metadata = await getImageMetadata(imagePath);
    return (
      !!metadata.width &&
      !!metadata.height &&
      metadata.width >= minWidth &&
      metadata.height >= minHeight
    );
  } catch {
    return false;
  }
};
