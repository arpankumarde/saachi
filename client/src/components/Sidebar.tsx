// components/Sidebar.tsx
"use client";

import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  Menu,
  MessageSquare,
  Brain,
} from "lucide-react";
import { AppView } from "../types";

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (v: AppView) => void;
  setRoute: (r: "LANDING" | "LOGIN" | "APP") => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  setRoute,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-stone-900 text-stone-300 transform transition-transform duration-300 ease-in-out z-30 lg:translate-x-0 lg:static flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 mb-6">
          <h1 className="font-serif text-2xl text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-saachi-primary rounded-lg flex items-center justify-center text-sm font-bold">S</span>
            Saachi
          </h1>
          <p className="text-xs text-stone-500 mt-2 ml-10">Wellness Pro</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: AppView.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
            { id: AppView.CHAT, label: "Chat", icon: MessageSquare },
            { id: AppView.MEMORY, label: "Memory", icon: Brain },
            { id: AppView.JOURNAL, label: "Journal", icon: BookOpen },
            { id: AppView.MENTOR, label: "Mentors", icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as AppView);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${currentView === item.id ? "bg-saachi-primary text-white shadow-lg" : "hover:bg-stone-800 hover:text-white"}`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? "text-white" : "text-stone-500 group-hover:text-white"}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <button
            onClick={() => setRoute("LANDING")}
            className="flex items-center gap-3 px-4 py-2 text-stone-500 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
