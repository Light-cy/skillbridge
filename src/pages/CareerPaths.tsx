import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCareerPaths } from "@/hooks/useCareerPaths";
import { useProfile } from "@/hooks/useProfile";
import { useCareerRoadmap } from "@/hooks/useCareerRoadmap";
import { CareerCard } from "@/components/career/CareerCard";
import { ExpertiseSelector, ExpertiseLevel } from "@/components/career/ExpertiseSelector";
import { RoadmapDisplay } from "@/components/career/RoadmapDisplay";
import { SavedRoadmapsList } from "@/components/career/SavedRoadmapsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CareerPath } from "@/types/database";
import { ArrowLeft, ArrowRight, Home, Compass, Target, Map, FolderOpen, Plus } from "lucide-react";

type Phase = "select-career" | "select-expertise" | "view-roadmap";

export default function CareerPaths() {
  const navigate = useNavigate();
  const { data: careerPaths, isLoading: isLoadingCareers } = useCareerPaths();
  const { data: profile } = useProfile();
  
  const [phase, setPhase] = useState<Phase>("select-career");
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState<ExpertiseLevel | null>(null);
  const [activeTab, setActiveTab] = useState<"generate" | "saved">("generate");
  const [isViewingSaved, setIsViewingSaved] = useState(false);
  
  const {
    roadmapContent,
    isGenerating,
    generateRoadmap,
    saveRoadmap,
    isSaving,
    resetRoadmap,
    chatMessages,
    isChatLoading,
    sendChatMessage,
    setChatContext,
    savedRoadmaps,
    isLoadingRoadmaps,
    loadSavedRoadmap,
    deleteRoadmap,
    isDeleting,
    isAutoSaving,
  } = useCareerRoadmap();

  const handleCareerSelect = (career: CareerPath) => {
    setSelectedCareer(career);
  };

  const handleExpertiseSelect = (level: ExpertiseLevel) => {
    setSelectedExpertise(level);
  };

  const handleNext = () => {
    if (phase === "select-career" && selectedCareer) {
      setPhase("select-expertise");
    } else if (phase === "select-expertise" && selectedExpertise && selectedCareer) {
      setPhase("view-roadmap");
      setIsViewingSaved(false);
      // Set chat context for AI chat
      setChatContext({
        careerPathName: selectedCareer.name,
        expertiseLevel: selectedExpertise,
        roadmapContent: "", // Will be updated after generation
      });
      generateRoadmap({
        careerPathId: selectedCareer.id,
        expertiseLevel: selectedExpertise,
        userProfile: {
          semester_number: profile?.semester_number,
          semester_bucket: profile?.semester_bucket,
          career_clarity: profile?.career_clarity,
          work_style: profile?.work_style,
        },
      });
    }
  };

  const handleBack = () => {
    if (phase === "select-expertise") {
      setPhase("select-career");
      setSelectedExpertise(null);
    } else if (phase === "view-roadmap") {
      setPhase("select-career");
      setSelectedCareer(null);
      setSelectedExpertise(null);
      resetRoadmap();
      setIsViewingSaved(false);
    }
  };

  const handleSaveRoadmap = () => {
    if (selectedCareer && selectedExpertise && roadmapContent) {
      saveRoadmap({
        careerPathId: selectedCareer.id,
        expertiseLevel: selectedExpertise,
        content: roadmapContent,
      });
    }
  };

  const handleRegenerate = () => {
    if (selectedCareer && selectedExpertise) {
      resetRoadmap();
      generateRoadmap({
        careerPathId: selectedCareer.id,
        expertiseLevel: selectedExpertise,
        userProfile: {
          semester_number: profile?.semester_number,
          semester_bucket: profile?.semester_bucket,
          career_clarity: profile?.career_clarity,
          work_style: profile?.work_style,
        },
      });
    }
  };

  const handleSelectSavedRoadmap = (roadmap: {
    id: string;
    career_path_id: string | null;
    expertise_level: string;
    roadmap_content: string;
    chat_messages: Array<{ role: string; content: string }> | null;
    created_at: string | null;
    updated_at: string | null;
    career_paths?: {
      name: string;
      icon: string | null;
    } | null;
  }) => {
    // Find the matching career path
    const matchingCareer = careerPaths?.find(c => c.id === roadmap.career_path_id);
    if (matchingCareer) {
      setSelectedCareer(matchingCareer);
    }
    setSelectedExpertise(roadmap.expertise_level as ExpertiseLevel);
    
    // Load the roadmap with properly typed messages
    loadSavedRoadmap({
      ...roadmap,
      chat_messages: (roadmap.chat_messages || []).map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      }))
    });
    
    setPhase("view-roadmap");
    setIsViewingSaved(true);
  };

  // Update chat context when roadmap content is ready
  useEffect(() => {
    if (roadmapContent && selectedCareer && selectedExpertise && !isGenerating) {
      setChatContext({
        careerPathName: selectedCareer.name,
        expertiseLevel: selectedExpertise,
        roadmapContent: roadmapContent,
      });
    }
  }, [roadmapContent, selectedCareer, selectedExpertise, isGenerating, setChatContext]);

  const phaseConfig = {
    "select-career": {
      icon: Compass,
      title: "Choose Your Career Path",
      description: "Select the career direction you want to explore",
      step: 1,
    },
    "select-expertise": {
      icon: Target,
      title: "Your Current Level",
      description: `How experienced are you in ${selectedCareer?.name || "this field"}?`,
      step: 2,
    },
    "view-roadmap": {
      icon: Map,
      title: "Your Roadmap",
      description: "AI-generated personalized career roadmap",
      step: 3,
    },
  };

  const currentPhase = phaseConfig[phase];
  const PhaseIcon = currentPhase.icon;

  if (phase === "view-roadmap" && selectedCareer && selectedExpertise) {
    return (
      <div className="min-h-screen bg-background">
        {/* Decorative background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container max-w-4xl mx-auto px-4 py-8">
          <RoadmapDisplay
            careerPath={selectedCareer}
            expertiseLevel={selectedExpertise}
            roadmapContent={roadmapContent}
            isLoading={isGenerating}
            onSave={handleSaveRoadmap}
            onRegenerate={handleRegenerate}
            onBack={handleBack}
            isSaving={isSaving}
            chatMessages={chatMessages}
            isChatLoading={isChatLoading}
            onSendMessage={sendChatMessage}
            isAutoSaving={isAutoSaving}
            isViewingSaved={isViewingSaved}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
            <Home className="w-4 h-4" />
            Dashboard
          </Button>
          
          {/* Progress Steps - only show when generating */}
          {activeTab === "generate" && (
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step === currentPhase.step
                      ? "bg-primary text-primary-foreground"
                      : step < currentPhase.step
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs for Generate / Saved */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "generate" | "saved")} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="generate" className="gap-2">
              <Plus className="w-4 h-4" />
              Generate New
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              My Roadmaps
              {savedRoadmaps && savedRoadmaps.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                  {savedRoadmaps.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="mt-8">
            <Card className="mb-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">My Saved Roadmaps</h2>
                    <p className="text-muted-foreground">View and continue your previously saved roadmaps</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SavedRoadmapsList
              roadmaps={savedRoadmaps}
              isLoading={isLoadingRoadmaps}
              onSelect={handleSelectSavedRoadmap}
              onDelete={deleteRoadmap}
              isDeleting={isDeleting}
            />
          </TabsContent>

          <TabsContent value="generate" className="mt-8">
            {/* Phase Header */}
            <Card className="mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <PhaseIcon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{currentPhase.title}</h1>
                    <p className="text-muted-foreground">{currentPhase.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase Content */}
            {phase === "select-career" && (
              <>
                {isLoadingCareers ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="p-6">
                        <div className="flex gap-4">
                          <Skeleton className="w-12 h-12 rounded-xl" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {careerPaths?.map((career) => (
                      <CareerCard
                        key={career.id}
                        career={career}
                        isSelected={selectedCareer?.id === career.id}
                        onSelect={handleCareerSelect}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {phase === "select-expertise" && (
              <div className="max-w-xl mx-auto">
                <ExpertiseSelector
                  selectedLevel={selectedExpertise}
                  onSelect={handleExpertiseSelect}
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={phase === "select-career"}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={
                  (phase === "select-career" && !selectedCareer) ||
                  (phase === "select-expertise" && !selectedExpertise)
                }
                className="gap-2"
              >
                {phase === "select-expertise" ? "Generate Roadmap" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
