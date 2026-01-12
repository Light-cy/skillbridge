import { Link } from 'react-router-dom';
import { useAlumni } from '@/hooks/useAlumni';
import { useCareerPaths } from '@/hooks/useCareerPaths';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, ArrowLeft, MessageCircle, Briefcase, GraduationCap, Quote } from 'lucide-react';

export default function AlumniPage() {
  const { data: alumni, isLoading } = useAlumni();
  const { data: careerPaths } = useCareerPaths();

  const getCareerName = (pathId: string | null) => {
    if (!pathId) return 'Various';
    return careerPaths?.find(cp => cp.id === pathId)?.name || 'Various';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
            </Button>
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg">Alumni Stories</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-display font-bold mb-2">Learn from Those Who've Been There</h1>
          <p className="text-muted-foreground max-w-2xl">
            Real stories from alumni who faced the same confusion and found their path. Chat with them for authentic advice.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader><div className="h-6 bg-muted rounded w-1/3" /></CardHeader>
                <CardContent><div className="h-20 bg-muted rounded" /></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {alumni?.map((alum, i) => (
              <Card key={alum.id} className="animate-slide-up hover:shadow-lg transition-all" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{alum.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Briefcase className="w-4 h-4" />
                        {alum.job_title} @ {alum.company}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {alum.graduation_year}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="w-fit mt-2">{getCareerName(alum.career_path_id)}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Their Journey</h4>
                    <p className="text-sm text-muted-foreground">{alum.story}</p>
                  </div>
                  
                  <div className="bg-accent/50 rounded-lg p-4">
                    <Quote className="w-4 h-4 text-primary mb-2" />
                    <p className="text-sm italic">"{alum.advice_quote}"</p>
                  </div>

                  {alum.struggles_faced && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">What They Struggled With</h4>
                      <p className="text-sm text-muted-foreground">{alum.struggles_faced}</p>
                    </div>
                  )}

                  <Button className="w-full" asChild>
                    <Link to={`/chat/${alum.id}`}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {alum.is_available_for_chat ? 'Chat with ' + alum.name.split(' ')[0] : 'View Profile'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}