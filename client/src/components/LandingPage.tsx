import React from 'react';
import { ArrowRight, Heart, Shield, Sparkles, Activity, Book, Brain, Calendar, Zap, Code, Layers, AlertTriangle, Lock, MessageSquare, Terminal } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-texture flex flex-col overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saachi-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-saachi-primary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center z-10 animate-fade-in-up">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-saachi-primary rounded-full flex items-center justify-center text-white font-serif font-bold">S</div>
            <span className="font-serif text-xl text-saachi-text font-bold">Saachi AI</span>
        </div>
        <button 
            onClick={onGetStarted}
            className="text-saachi-text font-medium hover:text-saachi-primary transition-colors text-sm"
        >
            Log In
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center pt-10 md:pt-20 px-4 relative z-10 max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-saachi-secondary text-saachi-primary text-xs font-medium mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <Sparkles className="w-3 h-3" />
                <span>Compassionate Mental Wellness</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl text-saachi-text font-medium mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Find balance with a <br/>
            <span className="italic text-saachi-primary">compassionate</span> companion.
            </h1>
            
            <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                Saachi is a compassionate mental wellness assistant combining empathetic chat, habit tracking, and memory‑aware context.
            </p>
            
            <button 
            onClick={onGetStarted}
            className="group inline-flex items-center gap-2 bg-saachi-text text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:bg-saachi-primary transition-all duration-300 hover:scale-105 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
            >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Core Features */}
        <div className="w-full mb-20 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="text-center mb-10">
                <h2 className="font-serif text-2xl text-saachi-text font-bold">Core Features</h2>
                <p className="text-stone-500 mt-2">Comprehensive tools for your well-being</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard 
                    icon={Heart} 
                    title="Empathetic AI Chat" 
                    desc="Empathetic AI chat powered by the obvix-wellness-v3 model." 
                />
                <FeatureCard 
                    icon={Activity} 
                    title="Mood Tracking" 
                    desc="Daily check-ins to monitor emotional trends." 
                />
                <FeatureCard 
                    icon={Book} 
                    title="Journaling & Goals" 
                    desc="Includes nudges, breathing guides, and goal setting." 
                />
                <FeatureCard 
                    icon={Brain} 
                    title="Memory System" 
                    desc="Short Term & Long Term Memory with embedding similarity." 
                />
                <FeatureCard 
                    icon={Zap} 
                    title="Task Extraction" 
                    desc="Automatically extracts tasks and reminders from conversations." 
                />
                <FeatureCard 
                    icon={Calendar} 
                    title="Mentor Scheduling" 
                    desc="Schedule sessions with mentors seamlessly." 
                />
            </div>
        </div>

        {/* Highlights & Safety Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {/* Tech Highlights */}
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl text-saachi-text font-bold">Highlights</h3>
                </div>
                
                <div className="space-y-6 flex-1">
                    <div>
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Layers className="w-3 h-3" /> Frontend
                        </h4>
                        <ul className="space-y-2 text-sm text-stone-600">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 font-bold">✓</span> Dynamic dashboard
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 font-bold">✓</span> Chat window with local history persistence
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 font-bold">✓</span> Conditional widget hiding after chat start
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Code className="w-3 h-3" /> Backend & Roadmap
                        </h4>
                        <ul className="space-y-2 text-sm text-stone-600">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold">→</span> Structured mentor booking backend
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold">→</span> Crisis phrase detection + escalation
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold">→</span> Vector index optimization
                            </li>
                             <li className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold">→</span> Export user data / privacy panel
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold">→</span> Streaming responses
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Safety */}
            <div className="bg-saachi-primary/5 p-8 rounded-3xl border border-saachi-primary/10 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-saachi-primary flex items-center justify-center text-white">
                        <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl text-saachi-text font-bold">Safety & Ethics</h3>
                </div>
                
                <div className="space-y-4 text-stone-600 text-sm leading-relaxed">
                    <p className="font-serif italic text-lg text-saachi-primary/80">
                        "Technology with a heart, boundaries with a purpose."
                    </p>
                    
                    <div className="bg-white/50 p-4 rounded-xl border border-saachi-primary/10 flex gap-3">
                        <MessageSquare className="w-5 h-5 text-saachi-primary flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-saachi-primary mb-1">Emotional Support</p>
                            <p className="text-stone-500 text-xs">
                               Assistant offers emotional support, not clinical advice.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/50 p-4 rounded-xl border border-saachi-primary/10 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-saachi-text mb-1">Crisis Management</p>
                            <p className="text-stone-500 text-xs">
                               Crisis intent should be redirected externally (future guardrails in progress).
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/50 p-4 rounded-xl border border-saachi-primary/10 flex gap-3">
                        <Lock className="w-5 h-5 text-stone-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-saachi-text mb-1">Privacy Focused</p>
                            <p className="text-stone-500 text-xs">
                               Your data is handled with care and respect for your personal boundaries.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <footer className="p-6 text-center text-stone-400 text-xs z-10 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
        &copy; {currentYear} Saachi Wellness. Not a substitute for professional medical advice.
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: any, title: string, desc: string }> = ({ icon: Icon, title, desc }) => (
    <div className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/50 hover:bg-white/60 transition-colors text-left group">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-saachi-primary shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-serif font-medium text-saachi-text mb-2">{title}</h3>
        <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;