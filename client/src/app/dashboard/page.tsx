// pages/dashboard.tsx
"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import MoodTracker from "@/components/MoodTracker";
import TaskPanel from "@/components/TaskPanel";
import LandingPage from "@/components/LandingPage";
import { Message, Task, MoodEntry, Memory, AppView } from "@/types";
import { sendMessageToSaachi, extractTasksFromConversation, memorizeFact  } from "@/lib/geminiClient";
import {
  BookOpen,
  Brain,
  RefreshCw,
  Database,
  Zap,
  Menu,
  LayoutDashboard,
  MessageSquare,
  Users,
  LogOut,
} from "lucide-react";

const DashboardPage: React.FC = () => {
  // --- Navigation State ---
  const [route, setRoute] = useState<"LANDING" | "LOGIN" | "APP">("APP"); // default open the app
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Feature State ---
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hello. I'm Saachi. I'm here to listen, support, and help you find balance. How are you feeling today?", timestamp: Date.now() },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const currentYear = new Date().getFullYear();

  // Dummy Tasks
  const [tasks, setTasks] = useState<Task[]>([
    { id: "t1", title: "Morning 5-min meditation", status: "completed", origin: "manual", dueDate: `${currentYear}-05-20` },
    { id: "t2", title: "Drink 2L of water", status: "pending", origin: "manual", dueDate: `${currentYear}-05-21` },
    { id: "t3", title: "Journal about gratitude", status: "pending", origin: "chat" },
    { id: "t4", title: "Walk in the park", status: "pending", origin: "manual", dueDate: `${currentYear}-05-22` },
  ]);

  // Dummy Mood Data (Last 7 days)
  const [moods, setMoods] = useState<MoodEntry[]>(() => {
    const data: MoodEntry[] = [];
    for (let i = 6; i >= 0; i--) {
      data.push({
        timestamp: Date.now() - i * 86400000,
        score: Math.floor(Math.random() * 3) + 2, // Random score between 2 and 5
      });
    }
    return data;
  });

  const [ltm, setLtm] = useState<Memory[]>([
    { id: "l1", type: "LTM", content: "User prefers morning sessions for reflection.", createdAt: Date.now() - 1000000 },
    { id: "l2", type: "LTM", content: "User finds nature walks calming.", createdAt: Date.now() - 500000 },
  ]);

  const [stm, setStm] = useState<Memory[]>([
    { id: "s1", type: "STM", content: "User: I am feeling a bit anxious today.", createdAt: Date.now() - 60000 },
    { id: "s2", type: "STM", content: "Saachi: I understand. Would you like to try a breathing exercise?", createdAt: Date.now() - 30000 },
  ]);

  // --- Handlers ---
  const handleSendMessage = async (text: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text, timestamp: Date.now() };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsTyping(true);

    setStm((prev) => [...prev, { id: crypto.randomUUID(), type: "STM", content: `User: ${text}`, createdAt: Date.now() }]);

    const responseText = await sendMessageToSaachi(updatedHistory, text, ltm);
    const aiMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: responseText, timestamp: Date.now() };

    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);

    setStm((prev) => [...prev, { id: crypto.randomUUID(), type: "STM", content: `Saachi: ${responseText}`, createdAt: Date.now() }]);

    extractTasksFromConversation(text, responseText).then((newTasks) => {
      if (newTasks.length > 0) {
        setTasks((prev) => [...prev, ...newTasks]);
      }
    });

    if (updatedHistory.length % 4 === 0) {
      memorizeFact(updatedHistory).then((fact) => {
        if (fact) {
          setLtm((prev) => [...prev, { id: crypto.randomUUID(), type: "LTM", content: fact, createdAt: Date.now() }]);
        }
      });
    }
  };

  const handleLogMood = (score: number) => {
    setMoods((prev) => [...prev, { timestamp: Date.now(), score }]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t)));
  };

  // Route shortcuts for demonstration (LANDING / LOGIN)
  if (route === "LANDING") return <LandingPage onGetStarted={() => setRoute("LOGIN")} />;
  if (route === "LOGIN") return <LoginPage onLogin={() => setRoute("APP")} />;

  const renderContent = () => {
    switch (currentView) {
      case AppView.CHAT:
        return (
          <div className="h-full p-4 lg:p-6 animate-fade-in-up flex flex-col">
            <div className="flex-1 min-h-0">
              <ChatInterface messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping} />
            </div>
          </div>
        );
      case AppView.MEMORY:
        return (
          <div className="p-6 lg:p-10 animate-fade-in-up h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-saachi-text">Memory Systems</h2>
              <button onClick={() => setStm([])} className="flex items-center gap-2 px-4 py-2 bg-white border border-saachi-secondary rounded-lg text-sm hover:bg-saachi-primary hover:text-white transition-colors shadow-sm text-stone-600">
                <RefreshCw className="w-4 h-4" />
                Refresh Context
              </button>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-saachi-secondary p-6 overflow-hidden flex flex-col">
                <h3 className="flex items-center gap-2 font-bold text-stone-500 uppercase tracking-wider mb-4 text-xs">
                  <Database className="w-4 h-4 text-amber-500" /> Long Term Memory (LTM)
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {ltm.length === 0 && <p className="text-stone-400 italic text-sm">No long-term memories formed yet.</p>}
                  {ltm.map((m) => (
                    <div key={m.id} className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-stone-700 shadow-sm text-sm leading-relaxed flex gap-3">
                      <span className="text-amber-500 font-bold mt-0.5">•</span>
                      {m.content}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-saachi-secondary p-6 overflow-hidden flex flex-col">
                <h3 className="flex items-center gap-2 font-bold text-stone-500 uppercase tracking-wider mb-4 text-xs">
                  <Zap className="w-4 h-4 text-green-500" /> Short Term Memory (STM)
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {stm.length === 0 && <p className="text-stone-400 italic text-sm">No active context.</p>}
                  {stm.map((m) => (
                    <div key={m.id} className="bg-white p-4 rounded-xl border border-stone-100 text-stone-600 shadow-sm text-sm leading-relaxed">
                      {m.content}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case AppView.MENTOR:
        return (
          <div className="p-6 lg:p-10 animate-fade-in-up">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-serif text-saachi-text mb-2">Mentor Connection</h2>
                <p className="text-stone-500">Connect with wellness experts for personalized guidance.</p>
              </div>
              <button className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-stone-800">My Bookings</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 rounded-full bg-stone-200 mb-4 overflow-hidden ring-4 ring-saachi-bg">
                    <img src={`https://picsum.photos/200/200?random=${i + 10}`} alt="Mentor" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-lg text-saachi-text">Dr. Emily Stone</h3>
                  <p className="text-xs font-medium text-saachi-primary mb-1">Clinical Psychologist</p>
                  <p className="text-xs text-stone-400 mb-6 px-4">Specializes in anxiety, mindfulness, and cognitive behavioral therapy.</p>
                  <button className="w-full py-2.5 bg-saachi-secondary/50 text-saachi-text font-medium rounded-xl text-sm hover:bg-saachi-primary hover:text-white transition-colors">Book Session</button>
                </div>
              ))}
            </div>
          </div>
        );
      case AppView.JOURNAL:
        return (
          <div className="p-6 lg:p-10 animate-fade-in-up flex items-center justify-center h-full text-stone-400">
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-stone-500">Journaling Space</h3>
              <p className="text-sm">Coming soon in the next update.</p>
            </div>
          </div>
        );
      case AppView.DASHBOARD:
      default:
        return (
          <div className="p-4 lg:p-6 h-full flex flex-col animate-fade-in-up overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-2 h-full min-h-0">
                <MoodTracker entries={moods} onLogMood={handleLogMood} />
              </div>
              <div className="h-full min-h-0">
                <TaskPanel tasks={tasks} onToggleTask={handleToggleTask} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-saachi-bg font-sans overflow-hidden bg-texture">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        setRoute={setRoute}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 h-full flex flex-col relative overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 bg-saachi-bg/90 backdrop-blur border-b border-saachi-secondary flex items-center justify-between z-20">
          <h1 className="font-serif text-lg text-saachi-text">Saachi AI</h1>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-saachi-text">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-hidden relative">{renderContent()}</div>
      </main>
    </div>
  );
};

export default DashboardPage;
