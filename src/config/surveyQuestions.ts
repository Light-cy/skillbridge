import { SemesterBucket } from '@/types/database';

export interface SurveyOption {
  value: string;
  label: string;
  desc: string;
}

export interface SurveyQuestion {
  id: string;
  title: string;
  description: string;
  options: SurveyOption[];
}

// Early semester (1-2): Exploration focus - low pressure, discovery-oriented
const EARLY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'excitement',
    title: 'What Excites You?',
    description: 'What draws you to this field?',
    options: [
      { value: 'curiosity', label: 'Curiosity & Learning', desc: 'I love discovering new things' },
      { value: 'creativity', label: 'Creating Things', desc: 'I enjoy building and making' },
      { value: 'problem-solving', label: 'Solving Problems', desc: 'I like figuring things out' },
      { value: 'impact', label: 'Making an Impact', desc: 'I want to help people' },
    ],
  },
  {
    id: 'learning_style',
    title: 'How Do You Learn Best?',
    description: 'What helps you understand new concepts?',
    options: [
      { value: 'videos', label: 'Watching Videos', desc: 'Visual explanations work best' },
      { value: 'reading', label: 'Reading & Notes', desc: 'I prefer text-based learning' },
      { value: 'hands-on', label: 'Hands-on Practice', desc: 'I learn by doing' },
      { value: 'discussions', label: 'Discussions', desc: 'Talking it through helps' },
    ],
  },
  {
    id: 'college_worry',
    title: 'Any Concerns?',
    description: "It's okay to have worries - we all do!",
    options: [
      { value: 'academics', label: 'Academics', desc: 'Keeping up with studies' },
      { value: 'social', label: 'Making Friends', desc: 'Finding my community' },
      { value: 'direction', label: 'Finding Direction', desc: 'Not sure what path to take' },
      { value: 'time', label: 'Managing Time', desc: 'Balancing everything' },
    ],
  },
  {
    id: 'settling',
    title: 'How Are You Settling In?',
    description: 'How is your college experience so far?',
    options: [
      { value: 'great', label: 'Loving It!', desc: "Everything's going well" },
      { value: 'adjusting', label: 'Still Adjusting', desc: 'Getting used to things' },
      { value: 'struggling', label: 'Finding It Hard', desc: 'Some challenges ahead' },
      { value: 'need-support', label: 'Need Support', desc: 'Could use some help' },
    ],
  },
];

// Mid semester (3-4): Direction focus - building clarity
const MID_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'clarity',
    title: 'Career Clarity',
    description: 'How clear are you about your career path?',
    options: [
      { value: 'confused', label: "Still Exploring", desc: 'Trying different things' },
      { value: 'exploring', label: "Seeing Options", desc: 'Some areas interest me' },
      { value: 'narrowing', label: "Narrowing Down", desc: 'Have a few ideas' },
      { value: 'decided', label: "Pretty Clear", desc: 'I know my direction' },
    ],
  },
  {
    id: 'interest_area',
    title: 'Which Area Interests You?',
    description: 'What domain excites you the most?',
    options: [
      { value: 'development', label: 'Development', desc: 'Building apps & software' },
      { value: 'design', label: 'Design', desc: 'UI/UX & creative work' },
      { value: 'data', label: 'Data & AI', desc: 'Analytics & machine learning' },
      { value: 'security', label: 'Security', desc: 'Cybersecurity & protection' },
    ],
  },
  {
    id: 'workstyle',
    title: 'Work Style',
    description: 'How do you prefer to work?',
    options: [
      { value: 'solo', label: 'Independent', desc: 'I prefer working alone' },
      { value: 'collaborative', label: 'Collaborative', desc: 'I thrive in teams' },
      { value: 'flexible', label: 'Flexible', desc: 'I adapt to both' },
    ],
  },
  {
    id: 'struggle',
    title: 'Current Challenge',
    description: "What's your biggest hurdle right now?",
    options: [
      { value: 'skill-gaps', label: 'Skill Gaps', desc: 'Need to learn more' },
      { value: 'unclear-path', label: 'Unclear Path', desc: "Don't know what to focus on" },
      { value: 'time', label: 'Time Management', desc: 'Too much to do' },
      { value: 'motivation', label: 'Motivation', desc: 'Hard to stay focused' },
    ],
  },
  {
    id: 'stress',
    title: 'How Are You Feeling?',
    description: 'Your overall stress level right now',
    options: [
      { value: 'low', label: 'Feeling Good', desc: "I'm managing well" },
      { value: 'moderate', label: 'Some Pressure', desc: 'A bit stressed but okay' },
      { value: 'high', label: 'Quite Stressed', desc: 'Feeling pressure often' },
      { value: 'severe', label: 'Overwhelmed', desc: 'Need support' },
    ],
  },
];

// Final semester (5+): Job-ready focus - career preparation
const FINAL_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'clarity',
    title: 'Career Clarity',
    description: 'How clear is your career direction?',
    options: [
      { value: 'confused', label: "Still Figuring Out", desc: 'Need more clarity' },
      { value: 'exploring', label: "Exploring Options", desc: 'Considering paths' },
      { value: 'narrowing', label: "Almost There", desc: 'Narrowing down choices' },
      { value: 'decided', label: "Decided", desc: 'I know my target' },
    ],
  },
  {
    id: 'target_role',
    title: 'Target Role',
    description: 'What type of role are you aiming for?',
    options: [
      { value: 'developer', label: 'Developer', desc: 'Software engineering roles' },
      { value: 'designer', label: 'Designer', desc: 'UI/UX & product design' },
      { value: 'analyst', label: 'Analyst', desc: 'Data & business analysis' },
      { value: 'other', label: 'Other/Unsure', desc: 'Different path or exploring' },
    ],
  },
  {
    id: 'skill_gap',
    title: 'Skills to Strengthen',
    description: 'What needs the most work?',
    options: [
      { value: 'technical', label: 'Technical Skills', desc: 'Coding, tools, tech stack' },
      { value: 'soft-skills', label: 'Soft Skills', desc: 'Communication, leadership' },
      { value: 'portfolio', label: 'Portfolio', desc: 'Projects & showcasing work' },
      { value: 'interview', label: 'Interview Prep', desc: 'Cracking interviews' },
    ],
  },
  {
    id: 'workstyle',
    title: 'Work Environment',
    description: 'How do you see yourself working?',
    options: [
      { value: 'solo', label: 'Independent', desc: 'Self-driven work' },
      { value: 'collaborative', label: 'Team-based', desc: 'Collaborative environment' },
      { value: 'flexible', label: 'Flexible', desc: 'Adapt to any setup' },
    ],
  },
  {
    id: 'job_blocker',
    title: "What's Holding You Back?",
    description: 'Your biggest barrier to job readiness',
    options: [
      { value: 'experience', label: 'Lack of Experience', desc: 'Need more practical work' },
      { value: 'skills', label: 'Skill Gaps', desc: 'Technical knowledge gaps' },
      { value: 'confidence', label: 'Confidence', desc: "Don't feel ready" },
      { value: 'opportunities', label: 'Finding Opportunities', desc: "Don't know where to apply" },
    ],
  },
  {
    id: 'stress',
    title: 'Pressure Level',
    description: 'How stressed are you about placements/jobs?',
    options: [
      { value: 'low', label: 'Calm & Ready', desc: 'Feeling prepared' },
      { value: 'moderate', label: 'Some Pressure', desc: 'Manageable stress' },
      { value: 'high', label: 'High Pressure', desc: 'Feeling the heat' },
      { value: 'severe', label: 'Very Anxious', desc: 'Need support' },
    ],
  },
];

export const SURVEY_QUESTIONS: Record<SemesterBucket, SurveyQuestion[]> = {
  early: EARLY_QUESTIONS,
  mid: MID_QUESTIONS,
  final: FINAL_QUESTIONS,
};

export const getSemesterBucket = (semester: number): SemesterBucket => {
  if (semester <= 2) return 'early';
  if (semester <= 4) return 'mid';
  return 'final';
};

export const getSemesterIntroText = (bucket: SemesterBucket): { title: string; description: string } => {
  switch (bucket) {
    case 'early':
      return {
        title: "Let's Get to Know You! 🌱",
        description: "Just starting out? No pressure! We'll ask a few quick questions to understand what excites you.",
      };
    case 'mid':
      return {
        title: "Building Your Path 🎯",
        description: "You're in the middle of your journey. Let's understand where you're heading.",
      };
    case 'final':
      return {
        title: "Time to Launch! 🚀",
        description: "The finish line is near. Let's make sure you're job-ready.",
      };
  }
};
