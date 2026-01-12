import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CareerPath } from "@/types/database";
import { ExpertiseLevel } from "./ExpertiseSelector";
import { 
  Loader2, Save, RefreshCw, ArrowLeft, MapPin, Sparkles, 
  MessageCircle, Send, ChevronDown, ChevronUp, Bot, User, Check, Cloud
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RoadmapDisplayProps {
  careerPath: CareerPath;
  expertiseLevel: ExpertiseLevel;
  roadmapContent: string;
  isLoading: boolean;
  onSave: () => void;
  onRegenerate: () => void;
  onBack: () => void;
  isSaving?: boolean;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  onSendMessage: (message: string) => void;
  isAutoSaving?: boolean;
  isViewingSaved?: boolean;
}

const expertiseLevelLabels: Record<ExpertiseLevel, string> = {
  complete_beginner: "Complete Beginner",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const starterPrompts = [
  "Explain the first step in more detail",
  "What if I'm short on time?",
  "Which project should I start with?",
  "What resources do you recommend?",
];

export function RoadmapDisplay({
  careerPath,
  expertiseLevel,
  roadmapContent,
  isLoading,
  onSave,
  onRegenerate,
  onBack,
  isSaving,
  chatMessages,
  isChatLoading,
  onSendMessage,
  isAutoSaving,
  isViewingSaved,
}: RoadmapDisplayProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isChatLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStarterPrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRegenerate}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Regenerate
          </Button>
          {!isViewingSaved && (
            <Button
              onClick={onSave}
              disabled={isLoading || !roadmapContent || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Roadmap
            </Button>
          )}
          {isViewingSaved && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground px-3">
              {isAutoSaving ? (
                <>
                  <Cloud className="w-4 h-4 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Saved
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Career Info Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{careerPath.name} Roadmap</h2>
              <p className="text-muted-foreground">
                Personalized for <span className="text-primary font-medium">{expertiseLevelLabels[expertiseLevel]}</span> level
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Content */}
      <Card className="min-h-[400px]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Your Personalized Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading && !roadmapContent ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Generating your roadmap...</p>
                <p className="text-sm text-muted-foreground">This may take a moment</p>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div 
                className="whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: formatMarkdown(roadmapContent || "") 
                }} 
              />
              {isLoading && (
                <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1" />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Section */}
      {roadmapContent && !isLoading && (
        <Card className="overflow-hidden">
          {/* Chat Toggle Header */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Chat with AI about this roadmap</p>
                <p className="text-sm text-muted-foreground">Ask questions, get clarifications, or explore alternatives</p>
              </div>
            </div>
            {isChatOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {/* Chat Content */}
          {isChatOpen && (
            <div className="border-t">
              {/* Messages Area */}
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {/* Welcome message */}
                  {chatMessages.length === 0 && (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                          <p className="text-sm text-foreground">
                            Have questions about your roadmap? I'm here to help! Ask me anything about the steps, 
                            skills, projects, or timeline. I can also suggest alternatives if you have constraints.
                          </p>
                        </div>
                      </div>

                      {/* Starter Prompts */}
                      <div className="pl-11 flex flex-wrap gap-2">
                        {starterPrompts.map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => handleStarterPrompt(prompt)}
                            className="text-sm px-3 py-1.5 rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chat Messages */}
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "flex-row-reverse"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          message.role === "user" ? "bg-primary" : "bg-primary/10"
                        )}
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4 text-primary-foreground" />
                        ) : (
                          <Bot className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 max-w-[80%]",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isChatLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your roadmap..."
                    disabled={isChatLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isChatLoading}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-4 text-foreground border-b pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4 text-foreground">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold"><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Lists
    .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 my-1">$1</li>')
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 my-1 list-decimal">$1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="my-4">')
    .replace(/\n/g, '<br />');
}
