import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateProfile } from '@/hooks/useProfile';
import { useSaveSurveyResponses } from '@/hooks/useSurvey';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { SemesterBucket, CareerClarity, WorkStyle, StressLevel } from '@/types/database';
import { 
  ArrowRight, ArrowLeft, Compass, Sparkles, GraduationCap, 
  Rocket, Target, Brain, Heart, BookOpen, Users, Briefcase,
  Star, Lightbulb, TrendingUp, CheckCircle2
} from 'lucide-react';
import { SURVEY_QUESTIONS, getSemesterBucket, getSemesterIntroText, SurveyQuestion } from '@/config/surveyQuestions';

type Phase = 'semester' | 'intro' | 'survey';

// Icon mapping for different question types
const getQuestionIcon = (questionId: string) => {
  const iconMap: Record<string, typeof Compass> = {
    excitement: Sparkles,
    learning_style: BookOpen,
    college_worry: Heart,
    settling: Users,
    clarity: Compass,
    interest_area: Brain,
    workstyle: Users,
    struggle: Target,
    stress: Heart,
    target_role: Briefcase,
    skill_gap: TrendingUp,
    job_blocker: Rocket,
  };
  return iconMap[questionId] || Sparkles;
};

// Loading skeleton for onboarding
function OnboardingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <Skeleton className="w-12 h-12 rounded-xl mx-auto" />
          <Skeleton className="h-7 w-48 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
          <Skeleton className="h-2 w-full mt-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Skeleton className="h-10 w-28" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Onboarding() {
  const [phase, setPhase] = useState<Phase>('semester');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [surveyStep, setSurveyStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const saveSurvey = useSaveSurveyResponses();

  const semesterBucket = useMemo(() => {
    if (!selectedSemester) return null;
    return getSemesterBucket(parseInt(selectedSemester));
  }, [selectedSemester]);

  const questions = useMemo(() => {
    if (!semesterBucket) return [];
    return SURVEY_QUESTIONS[semesterBucket];
  }, [semesterBucket]);

  const currentQuestion = questions[surveyStep];
  
  // Total steps: 1 (semester) + 1 (intro) + questions.length
  const totalSteps = 2 + questions.length;
  const currentStepNumber = phase === 'semester' ? 1 : phase === 'intro' ? 2 : 2 + surveyStep + 1;
  const progress = (currentStepNumber / totalSteps) * 100;

  const handleSemesterSelect = (semester: string) => {
    setSelectedSemester(semester);
    setAnswers({ semester });
  };

  const handleSemesterContinue = () => {
    setPhase('intro');
  };

  const handleIntroStart = () => {
    setPhase('survey');
  };

  const handleComplete = async () => {
    if (!semesterBucket) return;
    
    try {
      // Map answers to profile fields based on semester bucket
      const profileData: Record<string, unknown> = {
        semester_number: parseInt(selectedSemester),
        semester_bucket: semesterBucket,
        onboarding_completed: true,
      };

      // Map common fields
      if (answers.clarity) {
        profileData.career_clarity = answers.clarity as CareerClarity;
      } else if (semesterBucket === 'early') {
        // Early students default to 'exploring' - no pressure
        profileData.career_clarity = 'exploring' as CareerClarity;
      }

      if (answers.workstyle) {
        profileData.work_style = answers.workstyle as WorkStyle;
      }

      if (answers.stress) {
        profileData.stress_level = answers.stress as StressLevel;
      } else if (answers.settling) {
        // Map settling status to stress level for early students
        const settlingToStress: Record<string, StressLevel> = {
          'great': 'low',
          'adjusting': 'moderate',
          'struggling': 'high',
          'need-support': 'severe',
        };
        profileData.stress_level = settlingToStress[answers.settling] || 'moderate';
      }

      // Map struggle/challenge fields
      if (answers.struggle) {
        profileData.primary_struggle = answers.struggle;
      } else if (answers.college_worry) {
        profileData.primary_struggle = answers.college_worry;
      } else if (answers.job_blocker) {
        profileData.primary_struggle = answers.job_blocker;
      }

      await updateProfile.mutateAsync(profileData);

      // Save all survey responses
      await saveSurvey.mutateAsync(
        Object.entries(answers).map(([key, value]) => ({
          question_key: key,
          answer: value,
        }))
      );

      toast.success('Profile set up successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save. Please try again.');
    }
  };

  const handleBack = () => {
    if (phase === 'survey' && surveyStep > 0) {
      setSurveyStep(s => s - 1);
    } else if (phase === 'survey' && surveyStep === 0) {
      setPhase('intro');
    } else if (phase === 'intro') {
      setPhase('semester');
    }
  };

  const handleNext = () => {
    if (phase === 'survey' && surveyStep < questions.length - 1) {
      setSurveyStep(s => s + 1);
    } else if (phase === 'survey' && surveyStep === questions.length - 1) {
      handleComplete();
    }
  };

  const introText = semesterBucket ? getSemesterIntroText(semesterBucket) : null;
  const QuestionIcon = currentQuestion ? getQuestionIcon(currentQuestion.id) : Sparkles;

  // Progress indicator dots
  const renderProgressDots = () => {
    const dots = [];
    for (let i = 0; i < totalSteps; i++) {
      const isCompleted = i < currentStepNumber - 1;
      const isCurrent = i === currentStepNumber - 1;
      dots.push(
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isCompleted 
              ? 'bg-primary' 
              : isCurrent 
                ? 'bg-primary w-6' 
                : 'bg-muted-foreground/30'
          }`}
        />
      );
    }
    return dots;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      
      <Card className="w-full max-w-lg animate-scale-in relative z-10 shadow-xl border-primary/10">
        {/* Semester Selection Phase */}
        {phase === 'semester' && (
          <>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-display">Which Semester Are You In?</CardTitle>
              <CardDescription className="text-base">This helps us personalize your experience</CardDescription>
              
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {renderProgressDots()}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={selectedSemester} onValueChange={handleSemesterSelect}>
                <div className="grid grid-cols-2 gap-3">
                  {['1', '2', '3', '4', '5', '6', '7', '8'].map((sem) => {
                    const isSelected = selectedSemester === sem;
                    const bucket = getSemesterBucket(parseInt(sem));
                    const bucketEmoji = bucket === 'early' ? '🌱' : bucket === 'mid' ? '🚀' : '🎯';
                    
                    return (
                      <div 
                        key={sem} 
                        className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'border-border hover:border-primary/50 hover:bg-accent/50'
                        }`}
                        onClick={() => handleSemesterSelect(sem)}
                      >
                        <RadioGroupItem value={sem} id={`sem-${sem}`} className="sr-only" />
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                          isSelected ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                          {bucketEmoji}
                        </div>
                        <Label htmlFor={`sem-${sem}`} className="flex-1 cursor-pointer font-medium">
                          Semester {sem}
                        </Label>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-primary absolute right-3" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSemesterContinue} 
                  disabled={!selectedSemester}
                  className="group shadow-lg shadow-primary/20"
                  size="lg"
                >
                  Continue 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Intro Phase - Personalized message based on semester */}
        {phase === 'intro' && introText && (
          <>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 shadow-lg shadow-primary/20 animate-bounce">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-display">{introText.title}</CardTitle>
              <CardDescription className="text-base mt-2">{introText.description}</CardDescription>
              
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {renderProgressDots()}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visual info card */}
              <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="relative z-10 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 text-warning" />
                    <span className="text-lg font-semibold">{questions.length} Quick Questions</span>
                    <Star className="w-5 h-5 text-warning" />
                  </div>
                  <p className="text-muted-foreground">
                    Tailored specifically for 
                    <span className="font-medium text-foreground mx-1">
                      {semesterBucket === 'early' ? 'students just starting out' : 
                       semesterBucket === 'mid' ? 'students finding their direction' : 
                       'students preparing for careers'}
                    </span>
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      <span>No pressure</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Heart className="w-4 h-4 text-destructive" />
                      <span>Be honest</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Target className="w-4 h-4 text-success" />
                      <span>Get matched</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack} className="group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                </Button>
                <Button onClick={handleIntroStart} size="lg" className="group shadow-lg shadow-primary/20">
                  Let's Go! <Rocket className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Survey Phase - Dynamic questions based on semester bucket */}
        {phase === 'survey' && currentQuestion && (
          <>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                <QuestionIcon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Question {surveyStep + 1} of {questions.length}
                </span>
              </div>
              <CardTitle className="text-2xl font-display">{currentQuestion.title}</CardTitle>
              <CardDescription className="text-base">{currentQuestion.description}</CardDescription>
              
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {renderProgressDots()}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={answers[currentQuestion.id] || ''} 
                onValueChange={(v) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: v }))}
                className="space-y-3"
              >
                {currentQuestion.options.map((opt, index) => {
                  const isSelected = answers[currentQuestion.id] === opt.value;
                  
                  return (
                    <div 
                      key={opt.value} 
                      className={`relative flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/50 hover:bg-accent/30'
                      }`}
                      onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt.value }))}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <RadioGroupItem value={opt.value} id={`${currentQuestion.id}-${opt.value}`} className="mt-0.5" />
                      <Label htmlFor={`${currentQuestion.id}-${opt.value}`} className="flex-1 cursor-pointer">
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">{opt.desc}</div>
                      </Label>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-primary absolute right-4 top-4" />
                      )}
                    </div>
                  );
                })}
              </RadioGroup>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack} className="group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                </Button>
                {surveyStep < questions.length - 1 ? (
                  <Button 
                    onClick={handleNext} 
                    disabled={!answers[currentQuestion.id]}
                    size="lg"
                    className="group shadow-lg shadow-primary/20"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleComplete} 
                    disabled={!answers[currentQuestion.id] || updateProfile.isPending}
                    size="lg"
                    className="group shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/80"
                  >
                    {updateProfile.isPending ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Complete <CheckCircle2 className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
