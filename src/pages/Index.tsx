import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, Users, BookOpen, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Compass className="w-4 h-4" /> Your career clarity starts here
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
              Navigate Your Career with{' '}
              <span className="gradient-text">Confidence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Skill Bridge provides semester-aware guidance, alumni support, and AI-powered advice to help university students reduce career confusion and stress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">Built for Your Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're in your first semester or final year, Skill Bridge adapts to where you are.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Users, title: 'Alumni Stories', desc: 'Connect with graduates who faced the same confusion you do. Learn from their journeys.' },
            { icon: Sparkles, title: 'AI Career Guide', desc: 'Get personalized, semester-aware advice grounded in real career data.' },
            { icon: BookOpen, title: 'Electives Advisor', desc: 'Choose courses that align with your career goals and build the right skills.' },
          ].map((feature, i) => (
            <Card key={i} className="animate-slide-up hover:shadow-lg transition-shadow" style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">Why Students Love Skill Bridge</h2>
            <div className="space-y-4">
              {[
                'Personalized dashboard that adapts to your semester',
                'Real alumni stories that provide reassurance and direction',
                'AI guidance that understands early exploration vs. job-readiness',
                'Elective recommendations based on your career goals',
                'Real-time chat with alumni for authentic advice',
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button size="lg" asChild>
                <Link to="/auth">Start Your Journey <ArrowRight className="w-5 h-5 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-primary" />
            <span className="font-semibold">Skill Bridge</span>
          </div>
          <p>Helping students navigate their careers with confidence.</p>
        </div>
      </footer>
    </div>
  );
}