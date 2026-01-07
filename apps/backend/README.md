# Travel Tinder Backend API

A comprehensive backend system for the Travel Tinder application with authentication and profile management.

## Features

### 🔐 **Authentication**
- Email/Password authentication
- Email OTP (passwordless login)
- Mobile OTP (passwordless login)
- Google OAuth integration
- Apple Sign In integration
- JWT access & refresh tokens
- Multi-device logout support

### 👤 **Profile Management**
- Photo uploads (3-8 photos, auto-optimized)
- Rich profile information (bio, age, gender, etc.)
- Travel interests and preferences
- Language support
- Profile completion tracking
- Public profile viewing

### 🔒 **Security**
- JWT authentication with short-lived tokens
- Refresh token rotation
- Password hashing with bcrypt
- Email/mobile verification required
- Secure file upload validation
- Rate limiting ready

## Setup

### 1. Install Dependencies

```bash
cd apps/backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/travel-tinder
JWT_SECRET=your-secure-secret-key
JWT_REFRESH_SECRET=your-secure-refresh-key

# For Email OTP (Gmail example)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# For Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# For Apple Sign In
APPLE_CLIENT_ID=com.traveltinder.app
```

### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas:

```bash
# Local MongoDB
mongod
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The server will start on `http://localhost:8000`

## API Documentation

### Quick Links
- **[Authentication API](README.md#authentication-endpoints)** - Login, register, OAuth
- **[Profile API](PROFILE_API.md)** - Complete profile management documentation

### Health Check
```
GET /health
```

### Email/Password Authentication

#### Register with Email
```
POST /api/auth/register/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login with Email
```
POST /api/auth/login/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### Email OTP Authentication

#### Send OTP to Email
```
POST /api/auth/otp/email/send
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Verify Email OTP
```
POST /api/auth/otp/email/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Mobile OTP Authentication

#### Send OTP to Mobile
```
POST /api/auth/otp/mobile/send
Content-Type: application/json

{
  "mobile": "+1234567890"
}
```

#### Verify Mobile OTP
```
POST /api/auth/otp/mobile/verify
Content-Type: application/json

{
  "mobile": "+1234567890",
  "otp": "123456",
  "firstName": "John",
  "lastName": "Doe"
}
```

### OAuth Authentication

#### Google OAuth
```
POST /api/auth/oauth/google
Content-Type: application/json

{
  "idToken": "google-id-token-from-client"
}
```

#### Apple Sign In
```
POST /api/auth/oauth/apple
Content-Type: application/json

{
  "identityToken": "apple-identity-token",
  "appleId": "user-apple-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Token Management

#### Refresh Access Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout from All Devices
```
POST /api/auth/logout/all
Authorization: Bearer {accessToken}
```

### User Profile (Basic)

#### Get Current User Profile
```
GET /api/auth/profile
Authorization: Bearer {accessToken}
```

**Note:** For complete profile management (photos, bio, travel preferences, etc.), see [Profile API Documentation](PROFILE_API.md)

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## Database Models

### User Model
- `email`: User's email address
- `mobile`: User's mobile number
- `password`: Hashed password (for email/password auth)
- `googleId`: Google account ID
- `appleId`: Apple account ID
- `firstName`: User's first name
- `lastName`: User's last name
- `profilePicture`: Profile picture URL
- `isEmailVerified`: Email verification status
- `isMobileVerified`: Mobile verification status
- `authProvider`: Authentication provider used
- `lastLogin`: Last login timestamp

### OTP Model
- `identifier`: Email or mobile number
- `otp`: 6-digit OTP code
- `type`: "email" or "mobile"
- `purpose`: "login" or "verification"
- `expiresAt`: OTP expiration time (10 minutes)
- `attempts`: Number of verification attempts

### RefreshToken Model
- `userId`: Reference to User
- `token`: JWT refresh token
- `expiresAt`: Token expiration time (7 days)

## Security Considerations

1. **Password Requirements**
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 lowercase letter
   - At least 1 number

2. **OTP Security**
   - 6-digit random OTP
   - 10 minutes expiration
   - Maximum 3 verification attempts
   - Auto-deletion after use or expiration

3. **Token Management**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Tokens stored in database
   - Support for logout from all devices

4. **Environment Variables**
   - Never commit `.env` file
   - Use strong, random secrets in production
   - Rotate secrets periodically

## Integration Guide

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy Client ID and Client Secret to `.env`

### Setting up Apple Sign In

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Register your App ID
3. Enable Sign In with Apple capability
4. Create a Service ID
5. Configure return URLs
6. Generate a private key
7. Add credentials to `.env`

### Setting up Email (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in `SMTP_PASS`

## Development Notes

- Mobile OTP currently logs to console (integrate SMS service for production)
- Apple Sign In verification needs to be completed for production
- Set up proper email service (SendGrid, AWS SES) for production
- Configure CORS for your frontend domains
- Use HTTPS in production
- Implement rate limiting for OTP endpoints
- Add monitoring and logging

## Testing

You can test the API using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)
- Insomnia

Example cURL request:
```bash
curl -X POST http://localhost:8000/api/auth/otp/email/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /register/email` - Register with email/password
- `POST /login/email` - Login with email/password
- `POST /otp/email/send` - Send email OTP
- `POST /otp/email/verify` - Verify email OTP & login
- `POST /otp/mobile/send` - Send mobile OTP
- `POST /otp/mobile/verify` - Verify mobile OTP & login
- `POST /oauth/google` - Google OAuth login
- `POST /oauth/apple` - Apple Sign In
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout (single device)
- `POST /logout/all` - Logout all devices
- `GET /profile` - Get basic auth profile

### Profile Management (`/api/profile`)
- `GET /me` - Get my complete profile
- `PUT /me` - Update profile information
- `POST /photos` - Upload photos (multipart)
- `DELETE /photos` - Delete a photo
- `PUT /photos/reorder` - Reorder photos
- `GET /completion` - Check profile completion
- `GET /:userId` - View another user's profile (public)

For detailed profile API documentation, see [PROFILE_API.md](PROFILE_API.md)

## Project Structure

```
apps/backend/
├── src/
│   ├── config/
│   │   └── database.ts           # MongoDB connection
│   ├── constants/
│   │   └── profile.ts            # Profile-related constants
│   ├── controllers/
│   │   ├── auth.controller.ts    # Authentication logic
│   │   ├── oauth.controller.ts   # OAuth providers
│   │   └── profile.controller.ts # Profile management
│   ├── middleware/
│   │   ├── auth.ts               # JWT authentication
│   │   └── validation.ts         # Request validation
│   ├── models/
│   │   ├── User.ts               # User schema with profile
│   │   ├── OTP.ts                # OTP schema
│   │   └── RefreshToken.ts       # Refresh token schema
│   ├── routes/
│   │   ├── auth.routes.ts        # Auth endpoints
│   │   └── profile.routes.ts     # Profile endpoints
│   ├── utils/
│   │   ├── email.ts              # Email utilities
│   │   ├── jwt.ts                # JWT utilities
│   │   ├── otp.ts                # OTP utilities
│   │   ├── password.ts           # Password hashing
│   │   ├── fileUpload.ts         # File upload config
│   │   └── imageProcessor.ts     # Image processing
│   └── index.ts                  # Server entry point
├── uploads/                      # Uploaded files
│   └── profiles/                 # Profile photos
├── env.example                   # Environment template
├── README.md                     # This file
├── PROFILE_API.md               # Profile API docs
└── package.json                  # Dependencies
```

## Database Schema

### User Model (Extended)
```typescript
{
  // Authentication
  email?: string
  mobile?: string
  password?: string (hashed)
  googleId?: string
  appleId?: string
  facebookId?: string
  authProvider: string
  isEmailVerified: boolean
  isMobileVerified: boolean
  
  // Basic Info
  firstName?: string
  lastName?: string
  dateOfBirth?: Date
  age?: number
  gender?: string
  
  // Location
  homeCity?: string
  nationality?: string
  
  // Profile
  photos: string[] (3-8 photos)
  bio?: string (max 500 chars)
  languages: string[]
  travelInterests: string[]
  travelStyle?: string
  
  // Meta
  isProfileComplete: boolean
  profileCompletionPercentage: number
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}
```

## Features in Detail

### Profile Completion
The system automatically tracks profile completion:
- **Required for 100%:** 3+ photos, bio (20+ chars), age, gender, home city, nationality, languages, travel interests, travel style, name
- Updates automatically on each save
- Provides missing fields list via API

### Photo Management
- **Auto-optimization:** Images resized to 1080x1350 (4:5 ratio)
- **Validation:** Min 400x400px, max 5MB, JPEG/PNG/WebP only
- **Processing:** Uses Sharp for fast, high-quality processing
- **Reordering:** First photo is primary profile picture
- **Limits:** 3-8 photos required/allowed

### Travel Matching
Profile includes 30+ travel interests:
- adventure, food, culture, nightlife, beach, mountains
- photography, wildlife, hiking, diving, sailing
- art, museums, festivals, local-cuisine
- And more...

## License

MIT
