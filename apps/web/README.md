# TravelTinder Web Frontend

Modern web application for TravelTinder - Find your perfect travel companion.

## Features

✅ **Authentication**
- Email/Password login and signup
- Email OTP (passwordless)
- Mobile OTP (passwordless)
- Google OAuth (coming soon)
- Apple Sign In (coming soon)

✅ **User Experience**
- Beautiful, modern UI with Tailwind CSS
- Dark mode support
- Responsive design
- Toast notifications
- Protected routes
- Auto token refresh

✅ **State Management**
- React Context for auth state
- Local storage persistence
- Automatic session recovery

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 20+
- Backend API running on `http://localhost:8000`

### Installation

```bash
cd apps/web
npm install
```

### Environment Setup

The app uses `NEXT_PUBLIC_API_URL` environment variable. Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # Dashboard (protected)
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   └── ProtectedRoute.tsx # Auth wrapper
├── contexts/
│   └── AuthContext.tsx    # Auth state management
├── lib/
│   ├── api/              # API client and services
│   │   ├── client.ts     # Axios setup with interceptors
│   │   └── auth.ts       # Auth API calls
│   └── types/            # TypeScript types
│       └── auth.ts       # Auth types
└── public/               # Static assets
```

## Pages

### Landing Page (`/`)
- Hero section with features
- CTA buttons to login/signup
- Auto-redirect to dashboard if logged in

### Login Page (`/login`)
- Three authentication methods:
  - Email/Password
  - Email OTP
  - Mobile OTP
- OAuth buttons (Google, Apple)
- Link to signup

### Signup Page (`/signup`)
- Two registration methods:
  - With password
  - With OTP (passwordless)
- OAuth options
- Form validation
- Link to login

### Dashboard (`/dashboard`)
- Protected route (requires auth)
- User profile display
- Profile completion status
- Quick actions
- Logout functionality

## API Integration

### Authentication Flow

1. **Login/Signup** → Get access token + refresh token
2. **Store tokens** → localStorage
3. **API requests** → Auto-inject access token
4. **Token expired** → Auto-refresh using refresh token
5. **Refresh failed** → Redirect to login

### API Client

The `apiClient` (axios instance) automatically:
- Adds auth token to requests
- Handles token refresh on 401
- Redirects to login on auth failure

```typescript
// Example API call
import { loginWithEmail } from '@/lib/api/auth';

const response = await loginWithEmail({ email, password });
// Access token is automatically stored and used
```

## Components

### Button
Reusable button with variants and loading state:
```tsx
<Button 
  variant="primary" // primary | secondary | outline | ghost
  size="lg"         // sm | md | lg
  isLoading={loading}
  icon={<Icon />}
>
  Click Me
</Button>
```

### Input
Form input with label, error, and icon:
```tsx
<Input
  type="email"
  label="Email"
  placeholder="your@email.com"
  error={error}
  icon={<Mail />}
  required
/>
```

### ProtectedRoute
Wrapper for authenticated pages:
```tsx
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

## Authentication Context

Use the `useAuth` hook to access auth state:

```typescript
const { 
  user,              // Current user object
  isAuthenticated,   // Boolean
  isLoading,         // Boolean
  login,             // Function to set auth state
  logout,            // Function to clear auth state
  updateUser         // Function to update user data
} = useAuth();
```

## Styling

### Tailwind CSS
- Using Tailwind CSS 4
- Custom gradient backgrounds
- Dark mode support
- Responsive breakpoints

### Color Scheme
- Primary: Blue to Purple gradient
- Secondary: Gray scale
- Success: Green
- Error: Red

## Features in Detail

### Auto Token Refresh
- Access tokens are short-lived (15 minutes)
- Refresh tokens are long-lived (7 days)
- Automatic refresh on 401 errors
- Seamless user experience

### Protected Routes
- Redirect to login if not authenticated
- Loading state during auth check
- Persist auth across page refreshes

### Toast Notifications
- Success messages
- Error messages
- Custom styling
- Auto-dismiss

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly UI
- Optimized for all devices

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build
docker build -t traveltinder-web .

# Run
docker run -p 3000:3000 traveltinder-web
```

### Environment Variables
Remember to set `NEXT_PUBLIC_API_URL` in your deployment environment.

## Development Tips

1. **Hot Reload**: Changes are automatically reflected
2. **TypeScript**: Use types for better DX
3. **Console Errors**: Check browser console for errors
4. **Network Tab**: Debug API calls in browser dev tools

## Common Issues

### "Cannot find module '@/...'"
- Check tsconfig.json has path alias configured
- Restart dev server

### API calls failing
- Ensure backend is running on correct port
- Check CORS is enabled in backend
- Verify `NEXT_PUBLIC_API_URL` is set

### Dark mode not working
- Check Tailwind CSS configuration
- Ensure `dark:` classes are used

## Next Features

- [ ] Profile creation page
- [ ] Photo upload
- [ ] Travel preferences
- [ ] Swipe interface
- [ ] Match list
- [ ] Chat functionality
- [ ] Trip planning

## License

MIT
