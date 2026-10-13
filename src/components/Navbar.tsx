import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { Sprout, Wifi, WifiOff, Globe, Info, Volume2, VolumeX } from 'lucide-react';
import { stopSpeaking } from '../utils/speech';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  onOpenAbout: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  isOnline,
  onOpenAbout,
  isSpeaking,
  onStopSpeaking,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm shadow-emerald-700/20">
            <Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-emerald-950">
                AgriSaarthi AI
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {language === 'ta' ? 'விவசாய வழிகாட்டி' : 'Agri Companion'}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* TTS Stop Button if speaking */}
          {isSpeaking && (
            <button
              onClick={() => {
                stopSpeaking();
                onStopSpeaking();
              }}
              title={t.stopSpeaking}
              className="flex items-center gap-1 text-xs bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1.5 rounded-lg animate-pulse"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.stopSpeaking}</span>
            </button>
          )}

          {/* Online / Offline indicator */}
          <div
            title={isOnline ? t.online : t.offline}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">{t.online}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">{t.offline}</span>
              </>
            )}
          </div>

          {/* Language Switcher 3-Way */}
          <div className="relative flex items-center">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="appearance-none bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs py-1.5 pl-6 pr-5 rounded-xl border border-emerald-300 focus:outline-hidden cursor-pointer transition-colors shadow-2xs"
              aria-label="Select Language / மொழியை தேர்ந்தெடுக்கவும்"
              title="Select Language / மொழியை தேர்ந்தெடுக்கவும்"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="tanglish">Thanglish</option>
            </select>
            <Globe className="w-3.5 h-3.5 text-emerald-800 absolute left-1.5 pointer-events-none" />
            <div className="absolute right-1.5 pointer-events-none text-emerald-700 text-[9px]">▼</div>
          </div>

          {/* About / Info */}
          <button
            onClick={onOpenAbout}
            className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
            title={t.navAbout}
            aria-label={t.navAbout}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
