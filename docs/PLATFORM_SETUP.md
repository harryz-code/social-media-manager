# Platform Setup Guide

This guide covers the setup for the three text-focused social media platforms that are currently supported in PostGenius: LinkedIn, Reddit, and Threads.

## Overview

These platforms were chosen because they:
- **Focus on text content** - Perfect for our social media manager
- **Offer free APIs** - No paid subscriptions required
- **Have active communities** - High engagement potential
- **Cover different audiences** - Professional (LinkedIn), community (Reddit), and casual (Threads)

## 1. LinkedIn Setup

### Step 1: Create LinkedIn App
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com)
2. Click "Create App"
3. Fill in the app details:
   - App name: `PostGenius`
   - LinkedIn Page: Your company page (if applicable)
   - App logo: Upload a logo
4. Submit for review

### Step 2: Configure OAuth Settings
1. In your app dashboard, go to "Auth" tab
2. Add redirect URLs:
   - `http://localhost:3000/auth/linkedin/callback` (for development)
   - `https://yourdomain.com/auth/linkedin/callback` (for production)
3. Request access to these scopes:
   - `r_liteprofile` - Read basic profile
   - `r_emailaddress` - Read email address
   - `w_member_social` - Write posts

### Step 3: Get API Credentials
1. Copy your **Client ID** and **Client Secret**
2. Add them to your `.env.local` file:
```env
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
```

### Step 4: Request Marketing Developer Platform Access
1. Go to "Products" tab in your LinkedIn app
2. Request access to "Marketing Developer Platform"
3. This enables posting capabilities

## 2. Reddit Setup

### Step 1: Create Reddit App
1. Go to [Reddit App Preferences](https://reddit.com/prefs/apps)
2. Click "Create App" or "Create Another App"
3. Fill in the details:
   - Name: `PostGenius`
   - App type: **Web app**
   - Description: `Social media management tool`
   - About URL: `https://yourdomain.com`
   - Redirect URI: `http://localhost:3000/auth/reddit/callback`

### Step 2: Get API Credentials
1. After creating the app, you'll see:
   - **Client ID**: The string under your app name
   - **Client Secret**: Click "secret" to reveal it
2. Add them to your `.env.local` file:
```env
NEXT_PUBLIC_REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_REDDIT_REDIRECT_URI=http://localhost:3000/auth/reddit/callback
```

### Step 3: Understand Reddit API Limits
- Reddit API is free and generous
- Rate limits: 60 requests per minute
- No approval process required
- Supports text posts, link posts, and comments

## 3. Threads Setup

### Step 1: Create Instagram App
1. Go to [Facebook Developers](https://developers.facebook.com/apps)
2. Click "Create App"
3. Choose "Consumer" app type
4. Fill in app details:
   - App name: `PostGenius`
   - Contact email: Your email

### Step 2: Add Instagram Basic Display
1. In your app dashboard, click "Add Product"
2. Find and add "Instagram Basic Display"
3. Configure the product:
   - Add Instagram Basic Display
   - Set up OAuth redirect URIs:
     - `http://localhost:3000/auth/threads/callback`
     - `https://yourdomain.com/auth/threads/callback`

### Step 3: Configure Instagram Basic Display
1. Go to "Instagram Basic Display" > "Basic Display"
2. Add test users (your Instagram account)
3. Request these permissions:
   - `user_profile` - Read profile info
   - `user_media` - Read posts
   - `instagram_basic` - Basic access
   - `instagram_content_publish` - Post content (requires business account)

### Step 4: Get API Credentials
1. Copy your **Instagram App ID** and **Instagram App Secret**
2. Add them to your `.env.local` file:
```env
NEXT_PUBLIC_THREADS_CLIENT_ID=your_instagram_app_id_here
THREADS_CLIENT_SECRET=your_instagram_app_secret_here
NEXT_PUBLIC_THREADS_REDIRECT_URI=http://localhost:3000/auth/threads/callback
```

### Step 5: Important Notes for Threads
- Threads uses Instagram's API
- Posting requires a business/creator Instagram account
- Basic Display API is free but limited
- For full posting capabilities, you need Instagram Graph API

## Environment Variables Summary

Create a `.env.local` file in your project root with these variables:

```env
# LinkedIn
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
NEXT_PUBLIC_LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback

# Reddit
NEXT_PUBLIC_REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
NEXT_PUBLIC_REDDIT_REDIRECT_URI=http://localhost:3000/auth/reddit/callback

# Threads (Instagram)
NEXT_PUBLIC_THREADS_CLIENT_ID=your_instagram_app_id
THREADS_CLIENT_SECRET=your_instagram_app_secret
NEXT_PUBLIC_THREADS_REDIRECT_URI=http://localhost:3000/auth/threads/callback
```

## Testing the Integration

1. Start your development server: `npm run dev`
2. Go to the Platform Connections page
3. Click "Connect" for each platform
4. Complete the OAuth flow
5. Verify connections are successful

## Troubleshooting

### LinkedIn Issues
- **"Invalid redirect URI"**: Make sure the redirect URI in your LinkedIn app matches exactly
- **"Insufficient permissions"**: Request Marketing Developer Platform access
- **"App not approved"**: LinkedIn apps need approval for posting capabilities

### Reddit Issues
- **"Invalid client"**: Check your client ID and secret
- **"Redirect URI mismatch"**: Ensure redirect URI is exactly as configured
- **Rate limiting**: Reddit has generous limits, but respect them

### Threads Issues
- **"App not in development mode"**: Add your Instagram account as a test user
- **"Cannot post"**: Requires business/creator Instagram account
- **"Invalid scope"**: Make sure you've requested the right permissions

## Next Steps

Once you have these three platforms connected, you can:
1. Create and schedule posts
2. Cross-post content across platforms
3. Analyze engagement metrics
4. Use AI-powered content suggestions

## Platform-Specific Features

### LinkedIn
- Professional audience targeting
- Business-focused content
- Company page integration
- Professional analytics

### Reddit
- Community-specific posting
- Subreddit targeting
- Link and text posts
- Community engagement

### Threads
- Conversational content
- Instagram integration
- Visual and text posts
- Trending topics

## Security Notes

- Never commit your `.env.local` file to version control
- Use environment variables for all API credentials
- Regularly rotate your API keys
- Monitor API usage to stay within limits

