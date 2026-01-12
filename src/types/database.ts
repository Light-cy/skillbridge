export type SemesterBucket = 'early' | 'mid' | 'final';
export type CareerClarity = 'confused' | 'exploring' | 'narrowing' | 'decided';
export type WorkStyle = 'solo' | 'collaborative' | 'flexible';
export type StressLevel = 'low' | 'moderate' | 'high' | 'severe';
export type ExpertiseLevelType = 'complete_beginner' | 'beginner' | 'intermediate' | 'advanced';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  semester_number: number | null;
  semester_bucket: SemesterBucket | null;
  career_clarity: CareerClarity | null;
  work_style: WorkStyle | null;
  primary_struggle: string | null;
  stress_level: StressLevel | null;
  recommended_path_id: string | null;
  expertise_level: ExpertiseLevelType | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CareerPath {
  id: string;
  name: string;
  description: string | null;
  required_skills: string[];
  difficulty_level: string | null;
  avg_salary_range: string | null;
  growth_outlook: string | null;
  icon: string | null;
  created_at: string;
}

export interface Elective {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  skills_gained: string[];
  recommended_semester: number | null;
  career_path_ids: string[];
  relevance_score: number | null;
  created_at: string;
}

export interface Alumni {
  id: string;
  name: string;
  graduation_year: number | null;
  job_title: string | null;
  company: string | null;
  career_path_id: string | null;
  story: string | null;
  advice_quote: string | null;
  avatar_url: string | null;
  struggles_faced: string | null;
  is_available_for_chat: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_anonymous: boolean;
  is_read: boolean;
  created_at: string;
}

export interface SurveyResponse {
  id: string;
  user_id: string;
  question_key: string;
  answer: string;
  created_at: string;
}

export interface UserElective {
  id: string;
  user_id: string;
  elective_id: string;
  semester_taken: number | null;
  status: string;
  created_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  context: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserRoadmap {
  id: string;
  user_id: string;
  career_path_id: string;
  expertise_level: ExpertiseLevelType;
  roadmap_content: string;
  created_at: string;
  updated_at: string;
}
