# Profile Management API Documentation

Complete API documentation for user profile creation and management after login.

## Overview

After successful authentication, users can create and manage their profiles with the following features:
- Photo uploads (3-8 photos required)
- Bio and personal information
- Travel preferences and interests
- Profile completion tracking

## Authentication

All profile endpoints require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer {accessToken}
```

---

## Endpoints

### 1. Get My Profile

Get the authenticated user's complete profile.

**Endpoint:** `GET /api/profile/me`

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user-id",
      "email": "user@example.com",
      "mobile": "+1234567890",
      "firstName": "John",
      "lastName": "Doe",
      "photos": ["url1", "url2", "url3"],
      "bio": "Passionate traveler...",
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "age": 33,
      "gender": "male",
      "homeCity": "New York",
      "nationality": "American",
      "languages": ["English", "Spanish", "French"],
      "travelInterests": ["adventure", "food", "culture"],
      "travelStyle": "backpacking",
      "isProfileComplete": true,
      "profileCompletionPercentage": 100,
      "authProvider": "email",
      "isEmailVerified": true,
      "isMobileVerified": false
    }
  }
}
```

---

### 2. Update Profile

Update profile information (all fields optional).

**Endpoint:** `PUT /api/profile/me`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Passionate traveler exploring the world one country at a time. Love adventure sports, local cuisine, and meeting new people!",
  "dateOfBirth": "1990-01-01",
  "age": 33,
  "gender": "male",
  "homeCity": "New York",
  "nationality": "American",
  "languages": ["English", "Spanish", "French"],
  "travelInterests": ["adventure", "food", "culture", "hiking"],
  "travelStyle": "backpacking"
}
```

**Validations:**
- `firstName`: 1-50 characters
- `lastName`: 1-50 characters
- `bio`: Maximum 500 characters
- `age`: 18-100 years
- `dateOfBirth`: Valid ISO8601 date, user must be 18+
- `gender`: One of: male, female, non-binary, other, prefer-not-to-say
- `languages`: Array, maximum 10 languages
- `travelInterests`: Array, maximum 15 interests, must be valid options
- `travelStyle`: One of: budget, luxury, backpacking, comfort, mixed

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": {
      "id": "user-id",
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Passionate traveler...",
      "isProfileComplete": true,
      "profileCompletionPercentage": 100
    }
  }
}
```

---

### 3. Upload Photos

Upload profile photos (multipart/form-data).

**Endpoint:** `POST /api/profile/photos`

**Request:** Form-data with field name `photos` (multiple files)

**Constraints:**
- Minimum 3 photos required for complete profile
- Maximum 8 photos total
- Max file size: 5MB per photo
- Allowed formats: JPEG, JPG, PNG, WebP
- Minimum dimensions: 400x400 pixels
- Images automatically resized to 1080x1350 (4:5 ratio)

**Example using cURL:**
```bash
curl -X POST http://localhost:8000/api/profile/photos \
  -H "Authorization: Bearer {accessToken}" \
  -F "photos=@photo1.jpg" \
  -F "photos=@photo2.jpg" \
  -F "photos=@photo3.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "3 photo(s) uploaded successfully",
  "data": {
    "photos": ["url1", "url2", "url3", "url4", "url5"],
    "uploadedPhotos": ["url3", "url4", "url5"]
  }
}
```

---

### 4. Delete Photo

Delete a photo from profile.

**Endpoint:** `DELETE /api/profile/photos`

**Request Body:**
```json
{
  "photoUrl": "http://localhost:8000/uploads/profiles/profile-123456.jpg"
}
```

**Note:** Cannot delete photos if it would bring total below 3 photos for a complete profile.

**Response:**
```json
{
  "success": true,
  "message": "Photo deleted successfully",
  "data": {
    "photos": ["url1", "url2", "url3"]
  }
}
```

---

### 5. Reorder Photos

Change the order of profile photos. First photo is the primary profile photo.

**Endpoint:** `PUT /api/profile/photos/reorder`

**Request Body:**
```json
{
  "photoUrls": [
    "http://localhost:8000/uploads/profiles/profile-3.jpg",
    "http://localhost:8000/uploads/profiles/profile-1.jpg",
    "http://localhost:8000/uploads/profiles/profile-2.jpg"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Photos reordered successfully",
  "data": {
    "photos": ["url3", "url1", "url2"]
  }
}
```

---

### 6. Check Profile Completion

Get profile completion status and missing fields.

**Endpoint:** `GET /api/profile/completion`

**Response:**
```json
{
  "success": true,
  "data": {
    "isComplete": false,
    "completionPercentage": 70,
    "missingFields": [
      "photos (minimum 3)",
      "nationality",
      "travel style"
    ]
  }
}
```

---

### 7. Get User Profile (Public)

View another user's public profile information.

**Endpoint:** `GET /api/profile/:userId`

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user-id",
      "firstName": "Jane",
      "lastName": "Smith",
      "photos": ["url1", "url2", "url3"],
      "bio": "Adventure seeker...",
      "age": 28,
      "gender": "female",
      "homeCity": "London",
      "nationality": "British",
      "languages": ["English", "French"],
      "travelInterests": ["adventure", "culture", "food"],
      "travelStyle": "comfort"
    }
  }
}
```

**Note:** Only public information is returned (no email, mobile, verification status, etc.)

---

## Available Options

### Travel Interests

Users can select from the following travel interests:

- adventure
- food
- culture
- nightlife
- beach
- mountains
- city-tours
- wildlife
- photography
- history
- art
- shopping
- sports
- wellness
- festivals
- roadtrips
- camping
- diving
- hiking
- skiing
- sailing
- music
- architecture
- museums
- local-cuisine
- street-food
- wine-tasting
- volunteering
- spiritual
- eco-tourism

### Languages

Common languages available:

- English
- Spanish
- French
- German
- Italian
- Portuguese
- Russian
- Chinese
- Japanese
- Korean
- Arabic
- Hindi
- And more...

### Travel Styles

- **budget**: Cost-conscious travel, hostels, local transport
- **luxury**: High-end hotels, premium experiences
- **backpacking**: Budget travel with a backpack, very flexible
- **comfort**: Mid-range comfort, balance of cost and quality
- **mixed**: Flexible, depends on the destination/trip

### Gender Options

- male
- female
- non-binary
- other
- prefer-not-to-say

---

## Profile Completion

A profile is considered complete when it has:

1. ✅ At least 3 photos (up to 8)
2. ✅ Bio (minimum 20 characters)
3. ✅ Age or date of birth
4. ✅ Gender
5. ✅ Home city
6. ✅ Nationality
7. ✅ At least one language
8. ✅ At least one travel interest
9. ✅ Travel style
10. ✅ First and last name

**Profile completion percentage** is calculated automatically and updated on every save.

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "bio",
      "message": "Bio must not exceed 500 characters"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Photo Upload Error (400)
```json
{
  "success": false,
  "message": "Maximum 8 photos allowed. You have 6 photos."
}
```

---

## Best Practices

1. **Photos**
   - Upload high-quality, clear photos
   - First photo is most important (primary profile photo)
   - Minimum 400x400 pixels recommended
   - Use reorder endpoint to set preferred photo order

2. **Bio**
   - Make it engaging and personal
   - Mention travel experiences and interests
   - Keep under 500 characters

3. **Verification**
   - Complete email/mobile verification for safety
   - Verified users get better visibility

4. **Profile Completion**
   - Complete all fields for best matching
   - Regularly check completion status
   - Add multiple photos and interests

---

## Example: Complete Profile Setup Flow

```javascript
// 1. After login, check profile completion
GET /api/profile/completion

// 2. Update basic information
PUT /api/profile/me
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Love traveling...",
  "age": 30,
  "gender": "male",
  "homeCity": "New York",
  "nationality": "American",
  "languages": ["English", "Spanish"],
  "travelInterests": ["adventure", "food", "culture"],
  "travelStyle": "backpacking"
}

// 3. Upload photos (minimum 3)
POST /api/profile/photos
[FormData with 3+ photos]

// 4. Reorder photos if needed
PUT /api/profile/photos/reorder
{
  "photoUrls": ["url3", "url1", "url2"]
}

// 5. Verify profile is complete
GET /api/profile/completion
// Should return: isComplete: true, completionPercentage: 100

// 6. View final profile
GET /api/profile/me
```

---

## Integration with Mobile/Web

### React/React Native Example

```javascript
// Upload photos with progress
const uploadPhotos = async (files) => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('photos', file);
  });

  const response = await fetch('http://localhost:8000/api/profile/photos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData,
  });

  return response.json();
};

// Update profile
const updateProfile = async (profileData) => {
  const response = await fetch('http://localhost:8000/api/profile/me', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  return response.json();
};
```

---

## Security Notes

1. All profile routes require valid JWT authentication
2. Users can only modify their own profiles
3. Photo files are validated for type and size
4. Images are automatically processed and optimized
5. File uploads have size and format restrictions
6. Email/phone verification is mandatory for safety

---

## Troubleshooting

**Issue:** Photo upload fails
- Check file size (max 5MB)
- Verify file format (JPEG, PNG, WebP only)
- Ensure minimum dimensions (400x400)

**Issue:** Cannot delete photo
- Need minimum 3 photos for complete profile
- Check if photo URL is correct

**Issue:** Validation errors
- Review field constraints in documentation
- Check data types (arrays, strings, numbers)
- Verify enum values (gender, travelStyle, etc.)

**Issue:** Profile completion not updating
- Profile completion is calculated automatically on save
- Check all required fields are filled
- Bio must be at least 20 characters
