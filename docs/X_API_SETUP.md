# X (Twitter) API Setup Guide

This guide will help you set up the X (Twitter) API integration for your social media manager.

## Prerequisites

- A Twitter/X developer account
- Basic understanding of OAuth 2.0

## Step 1: Create a Twitter Developer Account

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Sign in with your Twitter account
3. Apply for a developer account if you don't have one
4. Wait for approval (usually takes 1-2 business days)

## Step 2: Create a New App

1. In the Twitter Developer Portal, click "Create App"
2. Fill in the required information:
   - **App name**: `Post Genius` (or your preferred name)
   - **App description**: `AI-powered social media management tool`
   - **Website URL**: `http://localhost:3000` (for development)
   - **Callback URLs**: `http://localhost:3000/auth/x/callback`
   - **Terms of Service URL**: (optional)
   - **Privacy Policy URL**: (optional)

## Step 3: Configure OAuth 2.0 Settings

1. In your app settings, go to the "Authentication" tab
2. Enable "OAuth 2.0"
3. Set the following:
   - **Type of App**: Web App
   - **Callback URLs**: `http://localhost:3000/auth/x/callback`
   - **Website URL**: `http://localhost:3000`
4. Save the changes

## Step 4: Get API Keys

1. Go to the "Keys and Tokens" tab
2. Copy the following credentials:
   - **API Key** (Client ID)
   - **API Secret** (Client Secret)

## Step 5: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# X (Twitter) API Configuration
NEXT_PUBLIC_X_CLIENT_ID=your_api_key_here
X_CLIENT_SECRET=your_api_secret_here
NEXT_PUBLIC_X_REDIRECT_URI=http://localhost:3000/auth/x/callback
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the Platform Connections page
3. Click "Connect" on the X (Twitter) card
4. Complete the OAuth flow
5. Test posting a tweet

## API Permissions

The X API integration requests the following scopes:
- `tweet.read` - Read tweets
- `tweet.write` - Post tweets
- `users.read` - Read user profile information
- `offline.access` - Refresh tokens

## Features

- ✅ OAuth 2.0 authentication with PKCE
- ✅ Post tweets with character limit enforcement (280 chars)
- ✅ Content formatting for X platform
- ✅ Token validation and refresh
- ✅ Error handling and user feedback

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Make sure the callback URL in your Twitter app settings matches exactly: `http://localhost:3000/auth/x/callback`

2. **"Client authentication failed" error**
   - Verify your API Key and API Secret are correct
   - Ensure the environment variables are properly set

3. **"Rate limit exceeded" error**
   - X has strict rate limits. Wait before making more requests
   - Consider implementing rate limiting in your app

4. **"Tweet too long" error**
   - The app automatically truncates content to 280 characters
   - Check your content length before posting

### Rate Limits

- **Tweets**: 300 per 3-hour window
- **User lookup**: 900 per 15-minute window
- **Profile updates**: 1000 per 24-hour window

## Security Notes

- Never commit your API keys to version control
- Use environment variables for all sensitive data
- Implement proper token storage and refresh mechanisms
- Consider implementing PKCE code verifier storage for production

## Production Deployment

For production deployment:

1. Update the callback URL to your production domain
2. Update the website URL in your Twitter app settings
3. Ensure all environment variables are set in your production environment
4. Implement secure token storage (not localStorage for production)
5. Add proper error handling and logging

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Twitter app settings
3. Ensure all environment variables are set correctly
4. Check the Twitter API documentation for any changes
