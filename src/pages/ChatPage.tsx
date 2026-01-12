import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/hooks/useProfile';
import { useAlumni } from '@/hooks/useAlumni';
import { useChatMessages, useSendMessage } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Compass, ArrowLeft, Send, User, MessageCircle, Shield } from 'lucide-react';

const PRESET_PROMPTS = [
  "What confused you in your first year?",
  "How did you decide on your career path?",
  "What skills do you wish you learned earlier?",
  "Any advice for someone feeling lost?",
];

export default function ChatPage() {
  const { alumniId } = useParams<{ alumniId: string }>();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: alumni } = useAlumni();
  const { data: messages, isLoading } = useChatMessages(alumniId || null);
  const sendMessage = useSendMessage();
  
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentAlumni = alumni?.find(a => a.id === alumniId);
  const isEarlyStudent = profile?.semester_bucket === 'early';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || newMessage.trim();
    if (!messageText || !alumniId) return;

    try {
      await sendMessage.mutateAsync({
        receiverId: alumniId,
        message: messageText,
        isAnonymous: isAnonymous && isEarlyStudent,
      });
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (!currentAlumni) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Alumni not found</p>
          <Button asChild><Link to="/alumni">Back to Alumni</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/alumni"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">{currentAlumni.name}</h1>
              <p className="text-sm text-muted-foreground">{currentAlumni.job_title} @ {currentAlumni.company}</p>
            </div>
          </div>
          {currentAlumni.is_available_for_chat && (
            <Badge variant="outline" className="text-success border-success">Available</Badge>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 container mx-auto px-4 py-4 flex flex-col max-w-3xl">
        {/* Preset Prompts */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_PROMPTS.map((prompt, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleSend(prompt)}
                disabled={sendMessage.isPending}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <Card className="flex-1 mb-4 overflow-hidden">
          <CardContent className="p-4 h-[400px] overflow-y-auto space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading messages...
              </div>
            ) : messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No messages yet</p>
                <p className="text-sm text-muted-foreground">Start a conversation with {currentAlumni.name.split(' ')[0]}!</p>
              </div>
            ) : (
              messages?.map((msg) => {
                const isOwn = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      isOwn 
                        ? 'bg-primary text-primary-foreground rounded-br-md' 
                        : 'bg-muted rounded-bl-md'
                    }`}>
                      {msg.is_anonymous && !isOwn && (
                        <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
                          <Shield className="w-3 h-3" /> Anonymous
                        </div>
                      )}
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        {/* Anonymous Toggle (Early students only) */}
        {isEarlyStudent && (
          <div className="flex items-center gap-2 mb-3 p-3 bg-accent/50 rounded-lg">
            <Shield className="w-4 h-4 text-primary" />
            <Label htmlFor="anonymous" className="text-sm flex-1">Send anonymously</Label>
            <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          </div>
        )}

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={sendMessage.isPending}
          />
          <Button type="submit" disabled={!newMessage.trim() || sendMessage.isPending}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </main>
    </div>
  );
}