# NextAuth Setup Guide

This document explains how to properly configure NextAuth for the finestcoder-admin application.

## 🔧 Initial Setup

### 1. Generate NEXTAUTH_SECRET

Run the following command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and use it for `NEXTAUTH_SECRET`.

### 2. Create `.env.local` file

Copy the `.env.example` file and create `.env.local` with your actual credentials:

```bash
cp .env.example .env.local
```

### 3. Configure Environment Variables

Edit `.env.local` and fill in the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-generated-secret>

# Backend API
BACKEND_URL=http://localhost:3001

# Google OAuth Credentials
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

## 🔑 Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create an OAuth 2.0 credential:
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. Copy the Client ID and Client Secret to `.env.local`

## ⚙️ Environment-Specific Configuration

### Development
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<dev-secret>
BACKEND_URL=http://localhost:3001
```

### Production
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<production-secret>
BACKEND_URL=https://your-backend-domain.com
```

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The application will be available at http://localhost:3000
```

## 📋 Troubleshooting

### Error: "NEXTAUTH_SECRET is not configured"
**Solution**: Make sure `.env.local` is in the root directory and contains `NEXTAUTH_SECRET`.

### Error: "Google OAuth credentials not found"
**Solution**: Verify that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set in `.env.local`.

### Error: "Configuration error at /api/auth/error"
**Solution**: This typically means:
1. Missing or invalid `NEXTAUTH_SECRET`
2. Missing Google OAuth credentials
3. Incorrect `NEXTAUTH_URL` (doesn't match the current domain)

Check the console for detailed error messages and ensure all variables are properly configured.

## 🔐 Security Notes

- **NEVER** commit `.env.local` to git
- **NEVER** use the same secret in production as development
- Use strong, randomly generated secrets (minimum 32 characters)
- Always use HTTPS in production (update `NEXTAUTH_URL` accordingly)
- Rotate secrets periodically in production

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth Environment Variables](https://next-auth.js.org/configuration/options)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
