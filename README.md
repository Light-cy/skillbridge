# Career Compass

Career Compass is a comprehensive career guidance platform designed to help students navigate their academic and professional journeys. Built with modern web technologies, it provides personalized career roadmaps, AI-powered advice, alumni networking, and progress tracking to empower users in making informed career decisions.

## Features

### Core Functionality
- **User Authentication**: Secure login and registration using Supabase Auth
- **Onboarding Survey**: Personalized assessment to understand user interests, skills, and goals
- **Career Path Exploration**: Browse and select from various career paths with detailed information
- **AI-Generated Roadmaps**: Custom career roadmaps generated using AI based on user profiles and selected paths
- **Progress Tracking**: Monitor academic and career progress with visual dashboards
- **Alumni Networking**: Connect with alumni through chat and mentorship opportunities
- **AI Assistant**: Get instant career advice and guidance through an AI-powered chatbot
- **Electives Advisor**: Receive recommendations for elective courses based on career goals

### User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Intuitive UI**: Clean, modern interface built with Shadcn UI components
- **Real-time Updates**: Live progress tracking and notifications
- **Offline Support**: Core functionality works without internet connection

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: High-quality, accessible UI components built on Radix UI
- **React Router**: Client-side routing
- **React Query**: Data fetching and state management
- **React Hook Form**: Form handling with validation

### Backend & Database
- **Supabase**: Backend-as-a-Service providing:
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Edge Functions (serverless)
  - Storage

### AI & Integrations
- **OpenAI API**: Powers AI-generated content (roadmaps, advice)
- **Supabase Edge Functions**: Serverless functions for AI processing

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## Project Structure

```
career-compass/
├── public/                          # Static assets
│   └── robots.txt
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── ui/                      # Shadcn UI components (50+ components)
│   │   ├── career/                  # Career-related components
│   │   │   ├── CareerCard.tsx       # Displays career path information
│   │   │   ├── ExpertiseSelector.tsx # Expertise level selection
│   │   │   ├── RoadmapDisplay.tsx   # Shows generated career roadmaps
│   │   │   └── SavedRoadmapsList.tsx # List of saved roadmaps
│   │   ├── dashboard/               # Dashboard components
│   │   │   └── ProgressSection.tsx  # Progress tracking UI
│   │   ├── progress/                # Progress-related components
│   │   │   └── AddProgressDialog.tsx # Dialog for adding progress
│   │   └── NavLink.tsx              # Navigation link component
│   ├── config/                      # Configuration files
│   │   └── surveyQuestions.ts       # Onboarding survey questions
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-mobile.tsx           # Mobile detection hook
│   │   ├── use-toast.ts             # Toast notifications
│   │   ├── useAlumni.ts             # Alumni data management
│   │   ├── useCareerPaths.ts        # Career paths data
│   │   ├── useCareerRoadmap.ts      # Roadmap generation
│   │   ├── useChat.ts               # Chat functionality
│   │   ├── useConversations.ts      # Conversation management
│   │   ├── useElectives.ts          # Electives data
│   │   ├── useProfile.ts            # User profile management
│   │   ├── useSurvey.ts             # Survey handling
│   │   └── useUserProgress.ts       # Progress tracking
│   ├── integrations/                # Third-party integrations
│   │   └── supabase/                # Supabase client setup
│   ├── lib/                         # Utility libraries
│   │   ├── auth.tsx                 # Authentication utilities
│   │   └── utils.ts                 # General utilities
│   ├── pages/                       # Page components
│   │   ├── Index.tsx                # Landing page
│   │   ├── Auth.tsx                 # Authentication page
│   │   ├── Onboarding.tsx           # User onboarding
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── CareerPaths.tsx          # Career paths browsing
│   │   ├── AlumniPage.tsx           # Alumni directory
│   │   ├── ChatPage.tsx             # Chat with alumni
│   │   ├── AIAssistant.tsx          # AI assistant interface
│   │   ├── ElectivesAdvisor.tsx     # Electives recommendations
│   │   └── NotFound.tsx             # 404 page
│   ├── types/                       # TypeScript type definitions
│   │   └── database.ts              # Database schema types
│   ├── App.tsx                      # Main app component with routing
│   ├── App.css                      # Global styles
│   ├── index.css                    # Additional styles
│   ├── main.tsx                     # App entry point
│   └── vite-env.d.ts                # Vite environment types
├── supabase/                        # Supabase backend
│   ├── config.toml                  # Supabase configuration
│   ├── functions/                   # Edge Functions
│   │   ├── ai-assistant/            # AI assistant function
│   │   ├── chat-roadmap/            # Chat-based roadmap generation
│   │   ├── electives-advisor/       # Electives recommendation
│   │   └── generate-roadmap/        # Main roadmap generation
│   └── migrations/                  # Database migrations
├── package.json                     # Node.js dependencies
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind CSS config
├── postcss.config.js                # PostCSS configuration
├── tsconfig*.json                   # TypeScript configurations
├── eslint.config.js                 # ESLint configuration
├── components.json                  # Shadcn UI configuration
└── index.html                       # HTML entry point
```

## How It Works

### Architecture Overview

Career Compass follows a modern full-stack architecture:

1. **Frontend**: React SPA handles user interactions, state management, and UI rendering
2. **Backend**: Supabase provides database, auth, and serverless functions
3. **AI Integration**: Edge Functions process AI requests using OpenAI API
4. **Real-time**: Supabase real-time subscriptions enable live updates

### Data Flow

1. **Authentication**: Users log in via Supabase Auth, JWT tokens manage sessions
2. **Onboarding**: Survey collects user data, stored in Supabase database
3. **Career Selection**: Users browse career paths, AI generates personalized roadmaps
4. **Progress Tracking**: Users log activities, visualized on dashboard
5. **Networking**: Alumni data enables connections and mentorship
6. **AI Assistance**: Edge functions handle AI queries for advice and recommendations

### Key Components & Agents

#### Frontend Components
- **App.tsx**: Root component managing routing and global state
- **Auth.tsx**: Handles login/registration flows
- **Dashboard.tsx**: Central hub showing progress and quick actions
- **CareerPaths.tsx**: Grid of available career paths with filtering
- **RoadmapDisplay.tsx**: Interactive roadmap visualization
- **AIAssistant.tsx**: Chat interface for AI-powered guidance

#### Backend Agents (Edge Functions)
- **generate-roadmap**: Creates personalized career roadmaps using AI
- **ai-assistant**: Provides general career advice and Q&A
- **electives-advisor**: Recommends elective courses based on career goals
- **chat-roadmap**: Generates roadmaps through conversational interface

#### Custom Hooks
- **useAuth**: Manages authentication state
- **useCareerRoadmap**: Handles roadmap generation and storage
- **useChat**: Manages real-time chat functionality
- **useUserProgress**: Tracks and updates user progress

### Database Schema

The application uses PostgreSQL via Supabase with tables for:
- Users (profiles, preferences)
- Career paths (definitions, requirements)
- Roadmaps (generated plans, milestones)
- Progress (user achievements, activities)
- Alumni (profiles, availability)
- Conversations (chat history)
- Electives (course recommendations)

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key (for AI features)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-compass
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and anon key
   - Add OpenAI API key

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

### Supabase Setup

1. Create a new Supabase project
2. Run the migrations in `supabase/migrations/`
3. Deploy the edge functions:
   ```bash
   supabase functions deploy
   ```
4. Configure environment variables in Supabase dashboard

## Usage

### For Students
1. **Sign Up**: Create account and complete onboarding survey
2. **Explore Careers**: Browse available career paths
3. **Generate Roadmap**: Get AI-generated personalized plan
4. **Track Progress**: Log activities and monitor advancement
5. **Connect**: Chat with alumni for mentorship
6. **Get Advice**: Use AI assistant for questions

### For Alumni
1. **Create Profile**: Share your career journey
2. **Mentor Students**: Engage in conversations
3. **Provide Guidance**: Help shape career roadmaps

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (via ESLint)

### Testing
- Component testing with React Testing Library
- E2E testing with Playwright (planned)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Guidelines
- Follow TypeScript best practices
- Use Shadcn UI components for consistency
- Write meaningful commit messages
- Test your changes thoroughly

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ using React, TypeScript, and Supabase
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
