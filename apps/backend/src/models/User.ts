import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  // Authentication fields
  email?: string;
  mobile?: string;
  password?: string;
  googleId?: string;
  appleId?: string;
  facebookId?: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  authProvider: "email" | "mobile" | "google" | "apple" | "facebook";
  lastLogin?: Date;

  // Profile fields
  photos: string[]; // Array of photo URLs
  bio?: string;
  dateOfBirth?: Date;
  age?: number;
  gender?: "male" | "female" | "non-binary" | "other" | "prefer-not-to-say";
  homeCity?: string;
  nationality?: string;
  languages: string[]; // Array of language codes or names
  travelInterests: string[]; // Tags like adventure, food, culture, etc.
  travelStyle?: "budget" | "luxury" | "backpacking" | "comfort" | "mixed";
  
  // Profile completion status
  isProfileComplete: boolean;
  profileCompletionPercentage: number;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    // Authentication fields
    email: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    googleId: {
      type: String,
      sparse: true,
    },
    appleId: {
      type: String,
      sparse: true,
    },
    facebookId: {
      type: String,
      sparse: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    authProvider: {
      type: String,
      enum: ["email", "mobile", "google", "apple", "facebook"],
      required: true,
    },
    lastLogin: {
      type: Date,
    },

    // Profile fields
    photos: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 8;
        },
        message: "Maximum 8 photos allowed",
      },
    },
    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "other", "prefer-not-to-say"],
    },
    homeCity: {
      type: String,
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    travelInterests: {
      type: [String],
      default: [],
    },
    travelStyle: {
      type: String,
      enum: ["budget", "luxury", "backpacking", "comfort", "mixed"],
    },

    // Profile completion
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ mobile: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ appleId: 1 });
UserSchema.index({ facebookId: 1 });
UserSchema.index({ homeCity: 1 });
UserSchema.index({ travelInterests: 1 });
UserSchema.index({ isProfileComplete: 1 });

// Method to calculate profile completion percentage
UserSchema.methods.calculateProfileCompletion = function (): number {
  let completedFields = 0;
  const totalFields = 10;

  if (this.photos && this.photos.length >= 3) completedFields++;
  if (this.bio && this.bio.length > 20) completedFields++;
  if (this.dateOfBirth || this.age) completedFields++;
  if (this.gender) completedFields++;
  if (this.homeCity) completedFields++;
  if (this.nationality) completedFields++;
  if (this.languages && this.languages.length > 0) completedFields++;
  if (this.travelInterests && this.travelInterests.length > 0) completedFields++;
  if (this.travelStyle) completedFields++;
  if (this.firstName && this.lastName) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
};

// Pre-save hook to update profile completion
UserSchema.pre("save", function (next) {
  this.profileCompletionPercentage = (this as any).calculateProfileCompletion();
  this.isProfileComplete = this.profileCompletionPercentage === 100;
  next();
});

export const User = mongoose.model<IUser>("User", UserSchema);
