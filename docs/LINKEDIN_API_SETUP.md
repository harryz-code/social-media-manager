# LinkedIn API Setup Guide

## Overview
This guide will help you set up LinkedIn API integration for Post Genius to enable real posting functionality.

## Prerequisites
- LinkedIn Developer Account
- A LinkedIn profile
- Access to LinkedIn Developer Portal

## Step 1: Create LinkedIn OAuth App

### 1.1 Access LinkedIn Developer Portal
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Sign in with your LinkedIn account
3. Click "Create App"

### 1.2 Create New App
1. **App Name**: `Post Genius` (or your preferred name)
2. **LinkedIn Page**: Select your LinkedIn page (or create one)
3. **App Logo**: Upload a logo (optional)
4. Click "Create App"

### 1.3 Configure OAuth 2.0 Settings
1. Go to "Auth" tab in your app
2. **Authorized Redirect URLs**: Add the following URLs:
   - `http://localhost:3000/auth/linkedin/callback` (for development)
   - `https://yourdomain.com/auth/linkedin/callback` (for production)
3. **OAuth 2.0 Scopes**: Add the following scopes:
   - `r_liteprofile` (Read basic profile)
   - `r_emailaddress` (Read email address)
   - `w_member_social` (Write posts)
   - `r_organization_social` (Read organization posts)

### 1.4 Get API Credentials
1. Go to "Products" tab
2. Add "Sign In with LinkedIn" product
3. Copy your **Client ID** and **Client Secret**

## Step 2: Environment Variables Setup

### 2.1 Create Environment File
Create or update your `.env.local` file:

```bash
# LinkedIn API Configuration
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
NEXT_PUBLIC_LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
```

### 2.2 Replace Placeholder Values
- Replace `your_linkedin_client_id_here` with your actual Client ID
- Replace `your_linkedin_client_secret_here` with your actual Client Secret

## Step 3: Test the Integration

### 3.1 Start Development Server
```bash
npm run dev
```

### 3.2 Test OAuth Flow
1. Navigate to your app
2. Go to the API Tester component
3. Click "Connect" for LinkedIn
4. Complete the OAuth flow
5. Verify connection status

### 3.3 Test Real Posting
1. In the API Tester, enter test content
2. Click "Test Post" for LinkedIn
3. Check your LinkedIn profile for the test post

## Step 4: Troubleshooting

### Common Issues

#### 1. "Invalid redirect URI" Error
- **Cause**: Redirect URI doesn't match exactly
- **Solution**: Double-check the redirect URI in both LinkedIn app settings and environment variables

#### 2. "Insufficient permissions" Error
- **Cause**: Missing required OAuth scopes
- **Solution**: Add all required scopes in LinkedIn app settings

#### 3. "Client ID not found" Error
- **Cause**: Environment variable not set correctly
- **Solution**: Restart development server after setting environment variables

#### 4. "Post creation failed" Error
- **Cause**: LinkedIn API rate limits or content policy violations
- **Solution**: 
  - Check LinkedIn's content policies
  - Ensure content doesn't violate LinkedIn's terms
  - Wait and retry if rate limited

### Rate Limits
- LinkedIn has rate limits for API calls
- Monitor usage in LinkedIn Developer Portal
- Implement proper error handling for rate limit responses

## Step 5: Production Deployment

### 5.1 Update Redirect URIs
1. Add your production domain to authorized redirect URLs
2. Update environment variables for production

### 5.2 Security Considerations
1. Never commit `.env.local` to version control
2. Use environment variables in production
3. Regularly rotate API keys
4. Monitor API usage and costs

## API Endpoints Used

### Authentication
- **Authorization URL**: `https://www.linkedin.com/oauth/v2/authorization`
- **Token URL**: `https://www.linkedin.com/oauth/v2/accessToken`

### Profile
- **Get Profile**: `GET https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,profilePicture)`

### Posts
- **Create Post**: `POST https://api.linkedin.com/v2/ugcPosts`
- **Get Post Analytics**: `GET https://api.linkedin.com/v2/socialActions/{postId}/statistics`

## Next Steps
After LinkedIn is working:
1. Set up Reddit API
2. Set up Threads API
3. Implement error handling and retry logic
4. Add analytics tracking
5. Implement bulk posting features

## Resources
- [LinkedIn API Documentation](https://developer.linkedin.com/docs)
- [LinkedIn OAuth 2.0 Guide](https://developer.linkedin.com/docs/oauth2)
- [LinkedIn UGC API](https://developer.linkedin.com/docs/guide/v2/shares/ugc-post-api)
- [LinkedIn Rate Limits](https://developer.linkedin.com/docs/guide/v2/rate-limits)
