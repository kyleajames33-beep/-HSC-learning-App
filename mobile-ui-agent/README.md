# HSC Learning App - Mobile UI Agent

A modern React-based Progressive Web Application (PWA) providing an engaging, mobile-optimized learning interface for HSC students with gaming elements, interactive quizzes, and comprehensive progress tracking.

## 🎯 Purpose

The Mobile UI Agent delivers the primary student-facing interface for the HSC Learning App ecosystem. It provides an interactive, gaming-style educational experience optimized for mobile devices, featuring adaptive quizzes, progress tracking, and engaging learning pathways for HSC Biology and Chemistry students.

## ✨ Features

### Core Technology & Architecture
- **React 18** with modern hooks and concurrent features
- **Vite Build System** for fast development and optimized production builds
- **Progressive Web App (PWA)** with offline functionality and app installation
- **TailwindCSS** for responsive, mobile-first design system
- **TypeScript Support** for enhanced development experience

### Gaming & Engagement System
- **XP & Leveling System** with points, levels, and achievement tracking
- **Boss Battle Interface** for challenging quiz experiences
- **Character Progression** with customizable student avatars
- **Achievement Badges** and milestone celebrations
- **Streak Tracking** to encourage daily learning habits
- **Leaderboard System** for competitive learning motivation
- **Gaming-style Animations** with Framer Motion for smooth micro-interactions

### Authentication & Security
- **Complete Authentication Flow** - Signup, login, logout, password recovery
- **Secure Token Management** with automatic session handling and renewal
- **Remember Me** functionality for persistent sessions
- **Error Boundaries** with graceful error handling and recovery
- **Input Validation** with real-time feedback

### Interactive Quiz System
- **Adaptive Quiz Engine** that adjusts difficulty based on performance
- **Multiple Question Types** - Multiple choice, long response, calculations
- **Real-time Timer** with progress tracking and auto-submission
- **Instant Feedback** with detailed explanations and learning tips
- **Quiz Setup & Configuration** for personalized learning paths
- **Results Analysis** with performance insights and improvement suggestions

### Subject-Specific Learning Hubs
- **Biology Hub** with specialized modules covering HSC syllabus
- **Chemistry Hub** with Module 5-8 content and calculations
- **Dot Point Detail** views for curriculum alignment and tracking
- **Long Response Practice** with structured answer guidance
- **Interactive Content** with chemistry equations and biology diagrams

### Progress Tracking & Analytics
- **Comprehensive Dashboard** with visual progress indicators
- **Performance Metrics** including accuracy, speed, and improvement trends
- **Module-specific Progress** with detailed breakdowns and weak areas
- **Learning Pathway Visualization** showing student journey and next steps
- **Study Statistics** with time tracking and session analytics

### Mobile Optimization & UX
- **Touch-optimized Controls** with proper touch targets (44px minimum)
- **Gesture Support** for intuitive navigation and interactions
- **Pull-to-Refresh** functionality for content updates
- **Battery Optimization** to preserve device performance
- **Network Awareness** with offline detection and smart syncing
- **Responsive Design** optimized for iOS and Android devices

### PWA Capabilities
- **App Installation** with native-like experience on mobile devices
- **Offline Functionality** with cached content and background sync
- **Push Notifications** (infrastructure ready)
- **App Shortcuts** for quick access to key features
- **Background Updates** for seamless content synchronization

### Accessibility & Inclusion
- **WCAG Compliance** with accessibility features throughout
- **Screen Reader Support** with proper ARIA labels and descriptions
- **Keyboard Navigation** for users with mobility challenges
- **High Contrast Support** for visual accessibility
- **Error Recovery** with clear instructions and alternative paths

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- Modern web browser with PWA support

### Setup Steps

1. **Navigate to mobile UI agent:**
   ```bash
   cd mobile-ui-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment configuration:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open `http://localhost:3000` in your browser

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Development Server
VITE_PORT=3000                               # Development server port
VITE_HOST=localhost                          # Development host

# API Configuration
VITE_API_BASE_URL=http://localhost:3002/api  # Backend API base URL
VITE_BACKEND_URL=http://localhost:3002       # Backend server URL
VITE_GATEWAY_URL=http://localhost:3002       # API gateway URL

# Environment
NODE_ENV=development                         # Environment mode

# PWA Configuration
VITE_APP_TITLE=HSC Learning App             # App title
VITE_APP_VERSION=1.0.0                      # App version
VITE_APP_DESCRIPTION=Interactive HSC Learning Platform  # App description

# Features
VITE_ENABLE_PWA=true                        # Enable PWA features
VITE_ENABLE_OFFLINE=true                    # Enable offline functionality
VITE_ENABLE_NOTIFICATIONS=true              # Enable push notifications

# Development Options
VITE_DEV_BYPASS_AUTH=false                  # Bypass authentication in development
```

## 📱 Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
```

### Production
```bash
npm run build        # Build optimized production bundle
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run lint         # Run ESLint for code quality checks
```

### Build Analysis
The production build includes several optimizations:
- **Code Splitting** - Automatic chunking by feature area
- **Tree Shaking** - Eliminates unused code
- **Minification** - Terser optimization with console removal
- **Asset Optimization** - Optimized images and fonts

## 📚 Application Features

### Authentication Flow
- **Welcome Screen** with app introduction and feature highlights
- **Login/Signup** with form validation and error handling
- **Password Recovery** with email-based reset flow
- **Session Management** with automatic token refresh

### Dashboard Experience
- **Progress Overview** with visual progress indicators
- **Quick Actions** for starting quizzes and accessing content
- **Achievement Display** showing badges and recent accomplishments
- **Study Streaks** with visual streak counters

### Quiz Experience
- **Quiz Setup** with subject, module, and difficulty selection
- **Interactive Questions** with touch-optimized answer selection
- **Real-time Progress** with visual progress bar and timer
- **Immediate Feedback** with explanations and learning tips
- **Results Analysis** with performance breakdown and recommendations

### Subject Learning Hubs
- **Biology Content** covering HSC modules with interactive elements
- **Chemistry Content** with equation rendering and calculation tools
- **Pathway Navigation** guiding students through curriculum progression

## 🛠 Technology Stack

### Frontend Framework
- **React 18** - Component-based UI library with concurrent features
- **Vite** - Fast build tool and development server
- **JavaScript/JSX** - Modern JavaScript with React syntax

### Styling & UI
- **TailwindCSS** - Utility-first CSS framework
- **PostCSS** - CSS processing and optimization
- **Framer Motion** - Animation library for smooth interactions

### State Management & Data
- **React Context** - Global state management
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API communication

### Routing & Navigation
- **React Router DOM** - Client-side routing and navigation
- **React Router** - Route-based code splitting

### Development Tools
- **ESLint** - Code linting and quality checks
- **Autoprefixer** - CSS vendor prefix automation
- **Terser** - JavaScript minification and optimization

### PWA & Mobile
- **Service Worker** - Offline functionality and caching
- **Web App Manifest** - PWA installation and configuration
- **Responsive Design** - Mobile-first design principles

### Charts & Visualization
- **Recharts** - Data visualization for progress tracking
- **Lucide React** - Icon library for consistent UI

### Interactive Features
- **@hello-pangea/dnd** - Drag and drop functionality
- **Touch Gestures** - Mobile-optimized interactions

## 📁 Project Structure

```
mobile-ui-agent/
├── public/                          # Static assets
│   ├── icons/                       # PWA icons and favicons
│   └── manifest.json               # PWA manifest
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── feedback/               # User feedback components
│   │   ├── Animations.jsx          # Animation utilities
│   │   ├── Button.jsx              # Button components
│   │   ├── Card.jsx                # Card layouts
│   │   ├── Modal.jsx               # Modal dialogs
│   │   ├── ErrorBoundary.jsx       # Error handling
│   │   └── ...                     # Other UI components
│   ├── context/                    # React context providers
│   │   └── AuthContext.jsx         # Authentication state
│   ├── hooks/                      # Custom React hooks
│   │   ├── usePWA.js              # PWA functionality
│   │   ├── useMobileOptimization.js # Mobile optimizations
│   │   ├── useProgressTracking.js  # Progress tracking
│   │   ├── useGamification.js      # Gaming features
│   │   └── ...                     # Other custom hooks
│   ├── pages/                      # Main application pages
│   │   ├── Welcome.jsx             # Welcome/landing page
│   │   ├── Login.jsx               # Authentication pages
│   │   ├── SignUp.jsx              # User registration
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── Quiz.jsx                # Quiz interface
│   │   ├── QuizResults.jsx         # Results display
│   │   ├── QuizSetup.jsx           # Quiz configuration
│   │   └── ...                     # Other pages
│   ├── utils/                      # Utility functions
│   │   ├── api.js                  # API communication
│   │   ├── quizAPI.js              # Quiz-specific APIs
│   │   ├── animations.js           # Animation helpers
│   │   └── ...                     # Other utilities
│   ├── data/                       # Static data and configs
│   │   └── learningPathways.js     # Learning pathway definitions
│   ├── main.jsx                    # Application entry point
│   ├── App.jsx                     # Main App component
│   └── index.css                   # Global styles
├── .env.example                    # Environment variables template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # TailwindCSS configuration
├── postcss.config.js               # PostCSS configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## 🏃‍♂️ Running Locally

### Development Mode
```bash
npm run dev:safe
```
- Ensures dev dependencies are installed even when NODE_ENV is set to production
- Frees the configured dev-server port before launching Vite
- Forces Vite to run with the `.env` host/port settings
- Automatically falls back to local mock data when backend agents are offline, so you can explore the UI without running the full stack

```bash
npm run dev
```
- Starts development server on port 3000
- Enables hot module replacement
- Provides source maps for debugging
- Includes development-only features

### Development Tips
- If a previous Vite instance is holding `:3000`, run `netstat -ano | findstr :3000` and `Stop-Process -Id <pid>` before restarting `npm run dev:safe`.
- Switch `VITE_DEV_BYPASS_AUTH` to `false` in `.env` (and restart the dev server) whenever you want to hit real backend agents instead of the mock/offline fallbacks.

### Production Preview
```bash
npm run build && npm run preview
```
- Creates optimized production build
- Starts local server to preview production version
- Tests PWA functionality and performance

### API Integration
Ensure the backend services are running:
- **Backend Agent** (port 3008) - Authentication and content management
- **Biology Agent** (port 3002) - Biology content and questions
- **Chemistry Agent** (port 3003) - Chemistry content and calculations

## 📱 PWA Features

### Installation
- **Add to Home Screen** on mobile devices
- **Desktop Installation** via browser
- **App Shortcuts** for quick access to key features
- **Standalone Mode** for native-like experience

### Offline Capabilities
- **Content Caching** for quiz questions and learning materials
- **Progress Sync** when connection is restored
- **Offline Indicators** showing connection status
- **Background Updates** for seamless content refresh

### Performance Optimizations
- **Service Worker** for resource caching and offline functionality
- **Code Splitting** for faster initial load times
- **Image Optimization** for reduced bandwidth usage
- **Battery Optimization** for extended mobile usage

## 🐛 Troubleshooting

### Common Issues

**Development Server Won't Start**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Build Failures**
```bash
# Check for TypeScript errors
npm run lint
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

**API Connection Issues**
- Verify backend services are running on correct ports
- Check CORS configuration in backend
- Ensure API URLs in `.env` are correct
- Verify network connectivity and firewall settings

**PWA Installation Issues**
- Ensure HTTPS is enabled (required for PWA)
- Check service worker registration
- Verify manifest.json is properly configured
- Test in supported browsers

**Mobile Performance Issues**
- Enable mobile optimizations in `useMobileOptimization` hook
- Check for memory leaks in components
- Optimize images and reduce bundle size
- Test on actual devices, not just browser dev tools

### Logs and Debugging
- **Browser DevTools** for debugging and performance analysis
- **Console Logs** for API calls and state changes (development only)
- **Network Tab** for API request/response debugging
- **Lighthouse** for PWA and performance auditing

### Mobile Testing
- **Real Device Testing** on iOS and Android
- **Browser Developer Tools** mobile simulation
- **PWA Testing** using Chrome DevTools Application tab
- **Performance Testing** with slow network conditions

For additional support, check the component documentation, review console logs, and ensure all environment variables are properly configured.
