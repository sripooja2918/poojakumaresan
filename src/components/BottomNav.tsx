import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { LayoutDashboard, Sprout, Bot, Mic, BookOpen } from 'lucide-react';

export type NavTab = 'home' | 'crops' | 'ai' | 'voice' | 'offline';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  const t = translations[language];

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: t.navHome, icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'crops', label: t.navCrops, icon: <Sprout className="w-5 h-5" /> },
    { id: 'ai', label: t.navAI, icon: <Bot className="w-5 h-5" /> },
    { id: 'voice', label: t.navVoice, icon: <Mic className="w-5 h-5" /> },
    { id: 'offline', label: t.navOffline, icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 min-h-[48px] ${
                isActive
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <div
                className={`transition-transform duration-150 ${
                  isActive ? 'scale-110 text-emerald-800' : 'text-slate-400'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] sm:text-xs mt-1 leading-tight tracking-tight line-clamp-1 text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
