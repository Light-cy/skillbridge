import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/hooks/useProfile';
import { useCareerPath } from '@/hooks/useCareerPaths';
import { useAlumni } from '@/hooks/useAlumni';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressSection } from '@/components/dashboard/ProgressSection';
import { 
  Compass, Users, MessageCircle, BookOpen, Sparkles, LogOut, 
  ArrowRight, Target, Lightbulb, Rocket, Star,
  GraduationCap, Briefcase, Code, Brain
} from 'lucide-react';

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <Skeleton className="w-24 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-16 h-8 rounded-md" />
            <Skeleton className="w-16 h-8 rounded-md" />
            <Skeleton className="w-16 h-8 rounded-md" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>

        {/* Alumni section */}
        <div className="space-y-4">
          <Skeleton className="h-7 w-40" />
          <div className="grid md:grid-cols-3 gap-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: recommendedPath } = useCareerPath(profile?.recommended_path_id ?? null);
  const { data: alumni } = useAlumni();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!profile?.onboarding_completed) {
    navigate('/onboarding');
    return null;
  }

  const semesterBucket = profile.semester_bucket;
  const firstName = profile.full_name?.split(' ')[0] || 'there';

  const getClarityStatus = () => {
    switch (profile.career_clarity) {
      case 'confused': return { label: 'Exploring', color: 'bg-warning/20 text-warning border-warning/30', icon: Compass };
      case 'exploring': return { label: 'Discovering', color: 'bg-info/20 text-info border-info/30', icon: Rocket };
      case 'narrowing': return { label: 'Focusing', color: 'bg-primary/20 text-primary border-primary/30', icon: Target };
      case 'decided': return { label: 'On Track', color: 'bg-success/20 text-success border-success/30', icon: Star };
      default: return { label: 'Starting', color: 'bg-muted text-muted-foreground border-muted', icon: Compass };
    }
  };

  const clarityStatus = getClarityStatus();
  const ClarityIcon = clarityStatus.icon;
  const featuredAlumni = alumni?.slice(0, semesterBucket === 'early' ? 3 : 2);

  const getProgressPercentage = () => {
    const semNum = profile.semester_number || 1;
    return Math.round((semNum / 8) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient accent */}
      <header className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg">Skill Bridge</span>
          </div>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors" asChild>
              <Link to="/alumni"><Users className="w-4 h-4 mr-2" />Alumni</Link>
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors" asChild>
              <Link to="/electives"><BookOpen className="w-4 h-4 mr-2" />Electives</Link>
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors" asChild>
              <Link to="/assistant"><Sparkles className="w-4 h-4 mr-2" />AI Guide</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl p-6 md:p-8" style={{ background: 'var(--gradient-hero)' }}>
          <div className="relative z-10 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👋</span>
              <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                Semester {profile.semester_number}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Welcome back, <span className="gradient-text">{firstName}</span>!
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {semesterBucket === 'early' && "You're just starting your journey — and that's exciting! Let's explore what interests you."}
              {semesterBucket === 'mid' && "You're in the heart of your journey. Time to focus on building key skills."}
              {semesterBucket === 'final' && "The finish line is in sight! Let's get you fully prepared for your career."}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-primary/10 rounded-full blur-2xl translate-y-1/2" />
        </div>

        {/* Progress & Status Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Journey Progress - Now using ProgressSection */}
          <ProgressSection 
            semesterNumber={profile.semester_number} 
            semesterBucket={semesterBucket} 
          />

          {/* Career Clarity Status */}
          <Card className="animate-slide-up group hover:shadow-lg transition-all duration-300" style={{ animationDelay: '0.15s' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ClarityIcon className="w-4 h-4 text-primary" />
                  </div>
                  Career Clarity
                </CardTitle>
                <Badge className={`${clarityStatus.color} border`}>{clarityStatus.label}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {profile.career_clarity === 'confused' && "It's okay to not know yet! Exploration is the first step."}
                  {profile.career_clarity === 'exploring' && "You're discovering new possibilities. Keep exploring!"}
                  {profile.career_clarity === 'narrowing' && "Great progress! You're getting closer to your path."}
                  {profile.career_clarity === 'decided' && "Excellent! You have a clear direction. Stay focused!"}
                  {!profile.career_clarity && "Let's discover what excites you!"}
                </p>
                {recommendedPath && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{recommendedPath.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Step Card */}
          <Card className="animate-slide-up border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-primary-foreground" />
                </div>
                Your Next Step
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {semesterBucket === 'early' && "Connect with alumni who were in your shoes. Their stories will inspire you."}
                {semesterBucket === 'mid' && "Explore the electives advisor to align your courses with your goals."}
                {semesterBucket === 'final' && "Use the AI assistant to build your personalized job-readiness roadmap."}
              </p>
              <Button size="sm" className="w-full group/btn" asChild>
                <Link to={semesterBucket === 'early' ? '/alumni' : semesterBucket === 'mid' ? '/electives' : '/assistant'}>
                  Get Started 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions with Visual Icons */}
        <section className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" /> Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="cursor-pointer group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-transparent hover:border-primary/20"
              onClick={() => navigate('/assistant')}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">AI Career Guide</h3>
                <p className="text-sm text-muted-foreground">Get personalized career advice</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-transparent hover:border-primary/20"
              onClick={() => navigate('/electives')}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-info/20 to-info/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-info" />
                </div>
                <h3 className="font-semibold mb-1">Electives Advisor</h3>
                <p className="text-sm text-muted-foreground">Find the best courses for you</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-transparent hover:border-primary/20"
              onClick={() => navigate('/alumni')}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold mb-1">Alumni Network</h3>
                <p className="text-sm text-muted-foreground">Connect with graduates</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-transparent hover:border-primary/20"
              onClick={() => navigate('/career-paths')}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-1">Career Paths</h3>
                <p className="text-sm text-muted-foreground">Get AI-powered roadmaps</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Alumni Stories with Better Visuals */}
        <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" /> Alumni Stories
            </h2>
            <Button variant="ghost" size="sm" className="group" asChild>
              <Link to="/alumni">
                View all 
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          {featuredAlumni && featuredAlumni.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {featuredAlumni.map((alum, index) => (
                <Card 
                  key={alum.id} 
                  className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${0.35 + index * 0.05}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="pb-2 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
                        {alum.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{alum.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {alum.job_title} @ {alum.company}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary/30 before:rounded-full">
                      <p className="text-sm text-muted-foreground line-clamp-3 italic">
                        "{alum.advice_quote}"
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full group/btn hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
                      <Link to={`/chat/${alum.id}`}>
                        <MessageCircle className="w-4 h-4 mr-2" /> 
                        Chat with {alum.name.split(' ')[0]}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No alumni stories available yet.</p>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
