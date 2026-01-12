import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useElectives, useAddUserElective } from '@/hooks/useElectives';
import { useCareerPaths } from '@/hooks/useCareerPaths';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Compass, ArrowLeft, BookOpen, Sparkles, Award, CheckCircle, Loader2, Plus } from 'lucide-react';

interface Recommendation {
  rank: number;
  elective_name: string;
  elective_code: string;
  relevance_score: number;
  skills_gained: string[];
  reasoning: string;
  is_best_recommended: boolean;
}

interface AIResult {
  recommendations: Recommendation[];
  comparison_summary: string;
  alumni_insight?: string;
  error?: string;
}

export default function ElectivesAdvisor() {
  const { data: profile } = useProfile();
  const { data: electives, isLoading: electivesLoading } = useElectives();
  const { data: careerPaths } = useCareerPaths();
  const addUserElective = useAddUserElective();

  const [targetSemester, setTargetSemester] = useState<string>('');
  const [careerGoal, setCareerGoal] = useState<string>(profile?.recommended_path_id || '');
  const [selectedElectives, setSelectedElectives] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);

  const handleElectiveToggle = (electiveName: string) => {
    setSelectedElectives(prev =>
      prev.includes(electiveName)
        ? prev.filter(e => e !== electiveName)
        : [...prev, electiveName]
    );
  };

  const handleAnalyze = async () => {
    if (!targetSemester) {
      toast.error('Please select your upcoming semester');
      return;
    }
    if (selectedElectives.length === 0) {
      toast.error('Please select at least one elective to analyze');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/electives-advisor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          userProfile: profile,
          selectedElectives,
          targetSemester: parseInt(targetSemester),
          careerGoal,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze electives. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToRoadmap = async (electiveCode: string) => {
    const elective = electives?.find(e => e.code === electiveCode);
    if (!elective) return;

    try {
      await addUserElective.mutateAsync({
        electiveId: elective.id,
        semesterTaken: parseInt(targetSemester),
      });
      toast.success(`Added ${elective.name} to your roadmap!`);
    } catch (error) {
      toast.error('Failed to add elective');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-semibold">Electives Advisor</h1>
              <p className="text-xs text-muted-foreground">AI-powered course recommendations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!result ? (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-display font-bold mb-2">Find Your Best Electives</h2>
              <p className="text-muted-foreground">
                Select your upcoming semester, career goal, and electives you're considering. Our AI will recommend the best choices.
              </p>
            </div>

            {/* Form */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Your Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upcoming Semester</Label>
                    <Select value={targetSemester} onValueChange={setTargetSemester}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5, 6, 7, 8].map(sem => (
                          <SelectItem key={sem} value={String(sem)}>Semester {sem}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Career Goal (Optional)</Label>
                    <Select value={careerGoal} onValueChange={setCareerGoal}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select career path" />
                      </SelectTrigger>
                      <SelectContent>
                        {careerPaths?.map(cp => (
                          <SelectItem key={cp.id} value={cp.id}>{cp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Electives to Consider</CardTitle>
                  <CardDescription>Select the electives available to you</CardDescription>
                </CardHeader>
                <CardContent>
                  {electivesLoading ? (
                    <div className="text-muted-foreground">Loading electives...</div>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {electives?.map(el => (
                        <div key={el.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50">
                          <Checkbox
                            id={el.id}
                            checked={selectedElectives.includes(el.name)}
                            onCheckedChange={() => handleElectiveToggle(el.name)}
                          />
                          <Label htmlFor={el.id} className="cursor-pointer flex-1">
                            <div className="font-medium">{el.code} - {el.name}</div>
                            <div className="text-xs text-muted-foreground">{el.skills_gained?.slice(0, 3).join(', ')}</div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Button size="lg" className="w-full md:w-auto" onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Get Recommendations
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold mb-1">Your Recommendations</h2>
                <p className="text-muted-foreground">Based on your career goal and profile</p>
              </div>
              <Button variant="outline" onClick={() => setResult(null)}>
                Start Over
              </Button>
            </div>

            {/* Recommendations */}
            <div className="grid gap-4">
              {result.recommendations?.map((rec) => (
                <Card key={rec.rank} className={`transition-all ${rec.is_best_recommended ? 'border-primary shadow-primary' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          rec.is_best_recommended ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          #{rec.rank}
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {rec.elective_code} - {rec.elective_name}
                            {rec.is_best_recommended && (
                              <Badge className="bg-primary">
                                <Award className="w-3 h-3 mr-1" /> Best Recommended
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">Relevance: {rec.relevance_score}%</Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleAddToRoadmap(rec.elective_code)}>
                        <Plus className="w-4 h-4 mr-1" /> Add to Roadmap
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{rec.reasoning}</p>
                    <div className="flex flex-wrap gap-2">
                      {rec.skills_gained?.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" /> {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            {result.comparison_summary && (
              <Card className="bg-accent/30">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Why This Recommendation?
                  </h3>
                  <p className="text-sm text-muted-foreground">{result.comparison_summary}</p>
                </CardContent>
              </Card>
            )}

            {result.alumni_insight && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">💡 Alumni Insight</h3>
                  <p className="text-sm italic text-muted-foreground">"{result.alumni_insight}"</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}