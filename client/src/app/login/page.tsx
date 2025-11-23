"use client"
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from "next/navigation";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      if (onLogin) onLogin();
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-texture flex items-center justify-center p-4 relative">
        {/* Background Blob */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-white/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white max-w-md w-full relative z-10 animate-fade-in-up">
            <div className="text-center mb-10">
                <div className="w-12 h-12 bg-saachi-primary rounded-xl mx-auto flex items-center justify-center text-white font-serif font-bold text-2xl mb-4 shadow-md">S</div>
                <h2 className="font-serif text-2xl text-saachi-text font-bold">Welcome Back</h2>
                <p className="text-stone-500 text-sm mt-2">Please sign in to continue your wellness journey.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-medium text-stone-600 uppercase tracking-wide mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-saachi-bg/50 border border-saachi-secondary rounded-xl py-3 pl-10 pr-4 text-saachi-text focus:outline-none focus:border-saachi-primary focus:bg-white transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-stone-600 uppercase tracking-wide mb-2">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-saachi-bg/50 border border-saachi-secondary rounded-xl py-3 pl-10 pr-4 text-saachi-text focus:outline-none focus:border-saachi-primary focus:bg-white transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-saachi-text text-white py-3 rounded-xl font-medium shadow-md hover:bg-saachi-primary transition-all flex items-center justify-center gap-2 group"
                >
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-xs text-stone-400">
                    Don't have an account? <a href="#" className="text-saachi-primary hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;