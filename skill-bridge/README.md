# 🎓 Skill Bridge

> **An AI-Powered Career Guidance Platform Connecting Students with Alumni**

Skill Bridge is a comprehensive full-stack web application designed to bridge the gap between students and alumni, providing personalized career guidance, real-time mentorship, and AI-powered recommendations for academic and professional success.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Core Functionalities](#-core-functionalities)
- [Major Features](#-major-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [File Descriptions](#-file-descriptions)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)

---

## 🎯 Overview

Skill Bridge addresses the common challenges students face when making career decisions:

- **Lack of Guidance**: Students often don't know which career path suits their skills and interests
- **Limited Access to Mentors**: Finding and connecting with industry professionals is difficult
- **Confusion About Electives**: Students struggle to choose electives that align with career goals
- **No Personalized Advice**: Generic career advice doesn't address individual needs

Our platform solves these problems by combining AI technology with human mentorship from successful alumni.

---

## ⚙️ Core Functionalities

### 1. 🔐 Authentication System
Secure user authentication powered by Supabase Auth supporting:
- Email/Password registration and login
- Session management
- Role-based access (Student/Alumni/Admin)
- Password recovery

### 2. 📝 Adaptive Post-Login Survey
An intelligent questionnaire that adapts based on user responses to:
- Understand student skills and interests
- Identify career aspirations
- Assess current knowledge level
- Determine preferred learning style

### 3. 📊 Personalized Dashboard
A customized dashboard displaying:
- Progress tracking
- Recommended actions
- Upcoming mentorship sessions
- Career path progress
- Quick access to all features

### 4. 🛤️ Career Path Recommendation
AI-powered career suggestions based on:
- Survey responses
- Skills assessment
- Interest analysis
- Market demand trends
- Alumni success patterns

### 5. 🌟 Alumni Success Stories
Inspirational stories featuring:
- Career journeys of successful alumni
- Industry insights
- Tips and advice
- Lessons learned

### 6. 💬 Real-Time Chat
Instant messaging system enabling:
- One-on-one student-alumni conversations
- Real-time message delivery
- Message history
- Online status indicators

### 7. 🤖 AI Guidance
Intelligent assistant providing:
- Career advice
- Skill development suggestions
- Interview preparation tips
- Resume feedback

### 8. 📚 Elective Recommendations
Smart course suggestions based on:
- Chosen career path
- Current skill gaps
- Alumni recommendations
- Industry requirements

---

## 🚀 Major Features

| Feature | Description |
|---------|-------------|
| **Smart Matching** | AI matches students with relevant alumni mentors |
| **Progress Tracking** | Visual representation of career development journey |
| **Skill Gap Analysis** | Identifies missing skills for target career |
| **Career Roadmap** | Step-by-step guide to reach career goals |
| **Real-Time Notifications** | Instant updates on messages and recommendations |
| **Mobile Responsive** | Works seamlessly on all devices |
| **Dark/Light Mode** | User preference for visual comfort |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript |
| **Backend** | Node.js + Express |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Real-Time** | Supabase Realtime |
| **AI Integration** | OpenAI / Custom AI Models |
| **Styling** | CSS3 |

---

## 📁 Project Structure

```
skill-bridge/
├── frontend/           # React frontend application
├── backend/            # Node.js backend server
├── supabase/           # Database migrations and edge functions
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── package.json        # Root package configuration
└── README.md           # Project documentation
```

---

## 📄 File Descriptions

### Root Files

| File | Purpose |
|------|---------|
| `package.json` | Root package configuration for monorepo management |
| `.env.example` | Template for environment variables needed to run the project |
| `.gitignore` | Specifies files and folders Git should ignore |
| `README.md` | Main project documentation (this file) |

---

### 📦 Frontend (`/frontend`)

#### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Frontend dependencies and scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `vite.config.ts` | Vite bundler configuration |
| `.env.example` | Frontend environment variables template |
| `index.html` | HTML entry point for the React app |

#### Source Files (`/frontend/src`)

| File | Purpose |
|------|---------|
| `main.tsx` | Application entry point, renders the root component |
| `App.tsx` | Main application component with routing setup |
| `vite-env.d.ts` | TypeScript declarations for Vite |

---

#### Components (`/frontend/src/components`)

##### Auth Components (`/components/auth`)
| File | Purpose |
|------|---------|
| `LoginForm.tsx` | User login form with email/password fields |
| `RegisterForm.tsx` | New user registration form |
| `AuthGuard.tsx` | Route protection component for authenticated pages |
| `index.ts` | Barrel export for auth components |

##### Chat Components (`/components/chat`)
| File | Purpose |
|------|---------|
| `ChatWindow.tsx` | Main chat container with message display |
| `MessageList.tsx` | Renders list of chat messages |
| `MessageInput.tsx` | Text input for composing messages |
| `ChatSidebar.tsx` | Sidebar showing conversation list |
| `index.ts` | Barrel export for chat components |

##### Dashboard Components (`/components/dashboard`)
| File | Purpose |
|------|---------|
| `DashboardOverview.tsx` | Main dashboard layout with summary cards |
| `ProfileCard.tsx` | Displays user profile information |
| `ProgressTracker.tsx` | Visual progress indicator for career goals |
| `StatsCard.tsx` | Statistics display card component |
| `index.ts` | Barrel export for dashboard components |

##### Survey Components (`/components/survey`)
| File | Purpose |
|------|---------|
| `SurveyContainer.tsx` | Main container managing survey flow |
| `SurveyQuestion.tsx` | Individual question renderer |
| `SurveyProgress.tsx` | Progress bar showing survey completion |
| `index.ts` | Barrel export for survey components |

##### Career Components (`/components/career`)
| File | Purpose |
|------|---------|
| `CareerPathCard.tsx` | Displays a single career path option |
| `CareerRoadmap.tsx` | Visual roadmap to career goals |
| `SkillGapAnalysis.tsx` | Shows skills needed vs current skills |
| `index.ts` | Barrel export for career components |

##### Alumni Components (`/components/alumni`)
| File | Purpose |
|------|---------|
| `AlumniStoryCard.tsx` | Card displaying alumni success story |
| `AlumniList.tsx` | Grid/list of available alumni mentors |
| `AlumniProfile.tsx` | Detailed alumni profile view |
| `index.ts` | Barrel export for alumni components |

##### Recommendations Components (`/components/recommendations`)
| File | Purpose |
|------|---------|
| `ElectiveCard.tsx` | Single elective course card |
| `ElectiveList.tsx` | List of recommended electives |
| `RecommendationPanel.tsx` | Panel showing AI recommendations |
| `index.ts` | Barrel export for recommendation components |

##### AI Components (`/components/ai`)
| File | Purpose |
|------|---------|
| `AIChatInterface.tsx` | Chat interface for AI assistant |
| `AISuggestionCard.tsx` | Displays AI-generated suggestions |
| `index.ts` | Barrel export for AI components |

##### Common Components (`/components/common`)
| File | Purpose |
|------|---------|
| `Button.tsx` | Reusable button component |
| `Input.tsx` | Reusable input field component |
| `Card.tsx` | Generic card container component |
| `Modal.tsx` | Popup modal component |
| `Loader.tsx` | Loading spinner component |
| `Navbar.tsx` | Top navigation bar |
| `Sidebar.tsx` | Side navigation menu |
| `Avatar.tsx` | User avatar display component |
| `index.ts` | Barrel export for common components |

---

#### Hooks (`/frontend/src/hooks`)

| File | Purpose |
|------|---------|
| `useAuth.ts` | Authentication state and methods hook |
| `useChat.ts` | Chat functionality hook |
| `useRealtime.ts` | Supabase realtime subscription hook |
| `useSurvey.ts` | Survey state management hook |
| `index.ts` | Barrel export for all hooks |

---

#### Services (`/frontend/src/services`)

| File | Purpose |
|------|---------|
| `supabaseClient.ts` | Supabase client initialization |
| `authService.ts` | Authentication API calls |
| `chatService.ts` | Chat-related API operations |
| `surveyService.ts` | Survey data operations |
| `careerService.ts` | Career recommendation API calls |
| `alumniService.ts` | Alumni data fetching |
| `aiService.ts` | AI assistant API integration |
| `index.ts` | Barrel export for services |

---

#### Context (`/frontend/src/context`)

| File | Purpose |
|------|---------|
| `AuthContext.tsx` | Global authentication state provider |
| `ChatContext.tsx` | Global chat state provider |
| `index.ts` | Barrel export for contexts |

---

#### Types (`/frontend/src/types`)

| File | Purpose |
|------|---------|
| `user.types.ts` | User-related TypeScript interfaces |
| `chat.types.ts` | Chat message and conversation types |
| `survey.types.ts` | Survey question and response types |
| `career.types.ts` | Career path and recommendation types |
| `alumni.types.ts` | Alumni profile and story types |
| `index.ts` | Barrel export for all types |

---

#### Utils (`/frontend/src/utils`)

| File | Purpose |
|------|---------|
| `helpers.ts` | General utility functions |
| `constants.ts` | Application-wide constants |
| `validation.ts` | Form validation functions |
| `index.ts` | Barrel export for utilities |

---

#### Styles (`/frontend/src/styles`)

| File | Purpose |
|------|---------|
| `globals.css` | Global CSS styles and resets |
| `variables.css` | CSS custom properties (colors, fonts, etc.) |
| `components.css` | Component-specific styles |

---

#### Pages (`/frontend/src/pages`)

| File | Purpose |
|------|---------|
| `HomePage.tsx` | Landing page for non-authenticated users |
| `LoginPage.tsx` | User login page |
| `RegisterPage.tsx` | User registration page |
| `SurveyPage.tsx` | Post-login adaptive survey |
| `DashboardPage.tsx` | Main user dashboard |
| `CareerPage.tsx` | Career path exploration page |
| `AlumniPage.tsx` | Browse and connect with alumni |
| `ChatPage.tsx` | Real-time messaging page |
| `AIGuidancePage.tsx` | AI assistant interaction page |
| `ElectivesPage.tsx` | Elective recommendations page |
| `ProfilePage.tsx` | User profile management |
| `index.ts` | Barrel export for pages |

---

### 🖥️ Backend (`/backend`)

#### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Backend dependencies and scripts |
| `tsconfig.json` | TypeScript configuration for Node.js |
| `.env.example` | Backend environment variables template |

#### Source Files (`/backend/src`)

| File | Purpose |
|------|---------|
| `server.ts` | Server startup and initialization |
| `app.ts` | Express app configuration and middleware setup |

---

#### Controllers (`/backend/src/controllers`)

| File | Purpose |
|------|---------|
| `authController.ts` | Handles authentication requests |
| `userController.ts` | User profile CRUD operations |
| `surveyController.ts` | Survey submission and retrieval |
| `careerController.ts` | Career recommendation logic |
| `alumniController.ts` | Alumni data management |
| `chatController.ts` | Chat message operations |
| `aiController.ts` | AI service integration |
| `electiveController.ts` | Elective recommendation logic |
| `index.ts` | Barrel export for controllers |

---

#### Routes (`/backend/src/routes`)

| File | Purpose |
|------|---------|
| `authRoutes.ts` | `/api/auth/*` routes |
| `userRoutes.ts` | `/api/users/*` routes |
| `surveyRoutes.ts` | `/api/survey/*` routes |
| `careerRoutes.ts` | `/api/career/*` routes |
| `alumniRoutes.ts` | `/api/alumni/*` routes |
| `chatRoutes.ts` | `/api/chat/*` routes |
| `aiRoutes.ts` | `/api/ai/*` routes |
| `electiveRoutes.ts` | `/api/electives/*` routes |
| `index.ts` | Combined route configuration |

---

#### Middleware (`/backend/src/middleware`)

| File | Purpose |
|------|---------|
| `authMiddleware.ts` | JWT token verification |
| `errorMiddleware.ts` | Global error handling |
| `validationMiddleware.ts` | Request body validation |
| `index.ts` | Barrel export for middleware |

---

#### Services (`/backend/src/services`)

| File | Purpose |
|------|---------|
| `supabaseService.ts` | Supabase client and database operations |
| `aiService.ts` | AI model integration (OpenAI, etc.) |
| `careerService.ts` | Career matching algorithms |
| `electiveService.ts` | Elective recommendation logic |
| `index.ts` | Barrel export for services |

---

#### Config (`/backend/src/config`)

| File | Purpose |
|------|---------|
| `environment.ts` | Environment variable parsing and validation |
| `supabase.ts` | Supabase configuration |
| `index.ts` | Barrel export for config |

---

#### Sockets (`/backend/src/sockets`)

| File | Purpose |
|------|---------|
| `chatSocket.ts` | WebSocket handlers for real-time chat |
| `index.ts` | Socket.io initialization |

---

#### Utils (`/backend/src/utils`)

| File | Purpose |
|------|---------|
| `apiResponse.ts` | Standardized API response helpers |
| `logger.ts` | Logging utility configuration |
| `helpers.ts` | General helper functions |
| `index.ts` | Barrel export for utilities |

---

#### Types (`/backend/src/types`)

| File | Purpose |
|------|---------|
| `index.ts` | Shared TypeScript interfaces |

---

#### Tests (`/backend/tests`)

| File | Purpose |
|------|---------|
| `setup.ts` | Test environment configuration |
| `auth.test.ts` | Authentication endpoint tests |
| `user.test.ts` | User endpoint tests |

---

### 🗄️ Supabase (`/supabase`)

| File/Folder | Purpose |
|-------------|---------|
| `config.toml` | Supabase local development configuration |

#### Migrations (`/supabase/migrations`)

| File | Purpose |
|------|---------|
| `00001_initial_schema.sql` | Creates users, profiles, and core tables |
| `00002_chat_tables.sql` | Creates chat and messaging tables |

#### Functions (`/supabase/functions`)

| Folder | Purpose |
|--------|---------|
| `ai-guidance/index.ts` | Edge function for AI guidance requests |
| `career-recommendation/index.ts` | Edge function for career matching |

#### Seed (`/supabase/seed`)

| File | Purpose |
|------|---------|
| `users.sql` | Sample user data for development |
| `alumni.sql` | Sample alumni profiles and stories |
| `electives.sql` | Sample course/elective data |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skill-bridge.git
   cd skill-bridge
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend && npm install

   # Install backend dependencies
   cd ../backend && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example files
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Frontend
   cd frontend && npm run dev

   # Terminal 2 - Backend
   cd backend && npm run dev
   ```

---

## 🔐 Environment Variables

### Frontend (`.env`)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:3000
```

### Backend (`.env`)
```
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
```

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Contributors

- Your Name - *Initial Development*

---

<p align="center">
  Made with ❤️ for Students and Alumni
</p>
