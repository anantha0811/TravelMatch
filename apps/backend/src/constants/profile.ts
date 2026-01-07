// Travel interests/tags available for users
export const TRAVEL_INTERESTS = [
  "adventure",
  "food",
  "culture",
  "nightlife",
  "beach",
  "mountains",
  "city-tours",
  "wildlife",
  "photography",
  "history",
  "art",
  "shopping",
  "sports",
  "wellness",
  "festivals",
  "roadtrips",
  "camping",
  "diving",
  "hiking",
  "skiing",
  "sailing",
  "music",
  "architecture",
  "museums",
  "local-cuisine",
  "street-food",
  "wine-tasting",
  "volunteering",
  "spiritual",
  "eco-tourism",
] as const;

// Common languages
export const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Polish",
  "Turkish",
  "Greek",
  "Hebrew",
  "Thai",
  "Vietnamese",
  "Indonesian",
  "Malay",
  "Tagalog",
  "Swahili",
] as const;

// Travel styles
export const TRAVEL_STYLES = [
  "budget",
  "luxury",
  "backpacking",
  "comfort",
  "mixed",
] as const;

// Gender options
export const GENDERS = [
  "male",
  "female",
  "non-binary",
  "other",
  "prefer-not-to-say",
] as const;

// Photo upload constraints
export const PHOTO_CONSTRAINTS = {
  MIN_PHOTOS: 3,
  MAX_PHOTOS: 8,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FORMATS: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  IMAGE_WIDTH: 1080,
  IMAGE_HEIGHT: 1350, // 4:5 ratio for profile photos
  THUMBNAIL_WIDTH: 300,
  THUMBNAIL_HEIGHT: 375,
} as const;

// Bio constraints
export const BIO_MAX_LENGTH = 500;

// Age constraints
export const AGE_CONSTRAINTS = {
  MIN_AGE: 18,
  MAX_AGE: 100,
} as const;
