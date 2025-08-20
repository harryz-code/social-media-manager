# Post Genius - AI-Powered Social Media Manager

A comprehensive social media management platform built with Next.js, TypeScript, and Tailwind CSS. Post Genius combines the best of Typefully with advanced AI capabilities to help you create, schedule, and optimize posts across multiple social media platforms.

## Features

### 🚀 Core Features
- **Multi-Platform Management**: Support for LinkedIn, Instagram, YouTube, Reddit, and more
- **Real AI Integration**: Hugging Face API-powered content enhancement and suggestions
- **Smart Scheduling**: Schedule posts across multiple platforms with automated publishing
- **Content Templates**: Pre-built templates for different content types with variable filling
- **Team Collaboration**: Share drafts, add comments, and collaborate with team members
- **Modern UI**: Beautiful, responsive design with excellent UX

### 🤖 AI Features
- **Real AI Integration**: Hugging Face API for content enhancement
- **Sentiment Analysis**: Analyze post tone and get optimization suggestions
- **Smart Hashtag Generation**: AI-generated hashtag recommendations
- **Platform Optimization**: Tailored suggestions for each social media platform
- **Engagement Predictions**: AI-powered engagement optimization tips

### 👥 Collaboration Features
- **Invite System**: Send email invites with viewer/editor roles
- **Real-time Comments**: Add and resolve comments on posts
- **Version History**: Track all changes made to posts
- **Share Links**: Generate shareable collaboration links
- **Role Management**: Admin, editor, and viewer permissions

### 📊 Analytics & Insights
- Real-time performance tracking
- Platform-specific metrics
- Engagement rate analysis
- Top-performing content identification
- Growth trends and insights

### 🎯 Content Management
- Rich text editor with character limits
- Content templates with variable filling
- Live preview for each platform
- Draft saving and management
- Bulk scheduling capabilities

### 🔗 Platform Integration
- **LinkedIn**: Professional networking posts
- **Instagram**: Photo and video content
- **YouTube**: Video content management
- **Reddit**: Community discussions
- **TikTok**: Short-form video content (coming soon)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Forms**: React Hook Form with Zod validation
- **AI Integration**: Hugging Face API
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **State Management**: Local Storage with custom services

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Hugging Face API key (optional, for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd social-media-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables (optional):
```bash
# Create .env.local file
echo "NEXT_PUBLIC_HUGGING_FACE_API_KEY=your_api_key_here" > .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
social-media-manager/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── Dashboard.tsx      # Main dashboard
│   ├── PostEditor.tsx     # Post creation/editing
│   ├── Calendar.tsx       # Content calendar
│   ├── Analytics.tsx      # Analytics dashboard
│   ├── Settings.tsx       # Settings page
│   ├── TemplateSelector.tsx # Content template selector
│   └── CollaborationPanel.tsx # Team collaboration panel
├── lib/                   # Utility libraries
│   ├── types.ts           # TypeScript type definitions
│   ├── storage.ts         # Local storage utilities
│   ├── ai.ts              # AI service with Hugging Face API
│   ├── collaboration.ts   # Collaboration system
│   ├── notifications.ts   # Notification service
│   ├── scheduler.ts       # Automated scheduling service
│   └── todos.ts           # To-do management system
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## API Integration Strategy

### Free API Options
- **LinkedIn**: LinkedIn Marketing API (free tier available)
- **Instagram**: Instagram Basic Display API (free)
- **YouTube**: YouTube Data API v3 (free quota)
- **Reddit**: Reddit API (free with rate limits)
- **TikTok**: TikTok for Developers (free tier)

### Mock Data
Currently using mock data for demonstration. Replace with actual API calls when ready to integrate with social media platforms.

## Key Features Explained

### AI Content Improvement
- Analyzes post content for engagement potential
- Suggests hashtags and call-to-actions
- Provides readability improvements
- Optimizes for platform-specific best practices

### Smart Scheduling
- Optimal posting time recommendations
- Cross-platform scheduling
- Timezone handling
- Bulk scheduling capabilities

### Analytics Dashboard
- Real-time performance metrics
- Platform comparison
- Engagement tracking
- Growth analytics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### Phase 1 (Completed) ✅
- ✅ Basic UI and navigation
- ✅ Post editor with AI suggestions
- ✅ Calendar view
- ✅ Analytics dashboard
- ✅ Settings page
- ✅ Content templates system
- ✅ Real AI integration with Hugging Face API
- ✅ Team collaboration system
- ✅ Automated scheduling service
- ✅ To-do management system

### Phase 2 (In Progress) 🔄
- 🔄 Content Calendar - Drag-and-drop interface
- 🔄 Bulk Operations - Schedule multiple posts
- 🔄 Real Platform Integrations (LinkedIn, Instagram, etc.)
- 🔄 Advanced Analytics Dashboard
- 🔄 Team Management & Authentication

### Phase 3 (Planned) 📋
- 📋 Advanced AI Content Optimization
- 📋 Real-time Notifications
- 📋 Media Management
- 📋 Performance Optimization
- 📋 Mobile Responsiveness
- 📋 Data Export & Backup

### Phase 4 (Future) 🚀
- 🚀 API Documentation
- 🚀 Multi-language Support
- 🚀 Dark Mode
- 🚀 Advanced Security Features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@postgenius.com or create an issue in this repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
