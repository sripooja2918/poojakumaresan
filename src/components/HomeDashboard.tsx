import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { NavTab } from './BottomNav';
import {
  Sprout,
  Bot,
  Mic,
  BookOpen,
  ArrowRight,
  PhoneCall,
  Volume2,
  Lightbulb,
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  Signal,
  Headphones,
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface HomeDashboardProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
  isOnline: boolean;
  onStartSpeaking: () => void;
  onStopSpeaking: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  language,
  onNavigate,
  isOnline,
  onStartSpeaking,
  onStopSpeaking,
}) => {
  const t = translations[language];

  const handleReadDailyTip = () => {
    onStartSpeaking();
    speakText(t.todayTipText, language, () => onStopSpeaking());
  };

  const featureCards = [
    {
      tab: 'crops' as NavTab,
      title: t.cardCropTitle,
      desc: t.cardCropDesc,
      icon: <Sprout className="w-7 h-7 text-emerald-800" />,
      bgIcon: 'bg-emerald-100',
      tag: t.offlineReady,
      tagBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      tab: 'ai' as NavTab,
      title: t.cardAITitle,
      desc: t.cardAIDesc,
      icon: <Bot className="w-7 h-7 text-emerald-800" />,
      bgIcon: 'bg-emerald-100',
      tag: isOnline ? 'Gemini 3.8 Flash' : t.offlineReady,
      tagBg: isOnline
        ? 'bg-blue-50 text-blue-800 border-blue-200'
        : 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      tab: 'voice' as NavTab,
      title: t.cardVoiceTitle,
      desc: t.cardVoiceDesc,
      icon: <Mic className="w-7 h-7 text-emerald-800" />,
      bgIcon: 'bg-emerald-100',
      tag: t.offlineReady,
      tagBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      tab: 'offline' as NavTab,
      title: t.cardOfflineTitle,
      desc: t.cardOfflineDesc,
      icon: <BookOpen className="w-7 h-7 text-emerald-800" />,
      bgIcon: 'bg-emerald-100',
      tag: t.offlineReady,
      tagBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
  ];

  return (
    <div className="space-y-5 pb-6">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 shadow-md relative overflow-hidden">
        {/* Subtle decorative leaf watermarks */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Sprout className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="bg-emerald-700/60 text-emerald-100 px-3 py-1 rounded-full border border-emerald-600/50 backdrop-blur-xs flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-amber-300" />
              {t.seasonBadge}
            </span>
            <span className="bg-emerald-700/60 text-emerald-100 px-3 py-1 rounded-full border border-emerald-600/50 backdrop-blur-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              {t.hackathonBadge}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.appName}
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
            {t.tagline} &mdash; {t.subtitle}
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('ai')}
              className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold px-4 py-2.5 rounded-xl shadow-xs text-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <Mic className="w-4 h-4 text-emerald-800" />
              <span>
                {language === 'ta'
                  ? 'தமிழில் பேசி கேட்க (குரல் முறை)'
                  : language === 'tanglish'
                  ? 'Kural-la Pesi Kelunga'
                  : 'Ask AI by Voice'}
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>

            <button
              onClick={() => onNavigate('voice')}
              className="bg-emerald-700/70 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl border border-emerald-600 text-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <Headphones className="w-4 h-4 text-emerald-200" />
              <span>{t.cardVoiceTitle}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Connectivity & Offline Readiness Banner */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            <Signal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-800">
                {isOnline ? t.online : t.offline}
              </span>
              <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                {t.offlineReady}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ta'
                ? 'பயிர் வழிகாட்டிகள், குரல் பதிவுகள் மற்றும் சேமித்த தகவல்கள் இணையம் இன்றியே செயல்படும்.'
                : 'Crop guides, voice recording, and saved tips operate 100% offline without internet.'}
            </p>
          </div>
        </div>
      </div>

      {/* Four Primary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {featureCards.map((card) => (
          <div
            key={card.tab}
            onClick={() => onNavigate(card.tab)}
            className="group bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div
                  className={`w-12 h-12 rounded-xl ${card.bgIcon} flex items-center justify-center group-hover:scale-105 transition-transform`}
                >
                  {card.icon}
                </div>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${card.tagBg}`}
                >
                  {card.tag}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                {card.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
              <span>{language === 'ta' ? 'திறக்கவும்' : 'Open Section'}</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
        ))}
      </div>

      {/* Today's Farm Advice Card */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{t.tipOfTheDay}</span>
          </div>

          <button
            onClick={handleReadDailyTip}
            className="flex items-center gap-1 text-xs font-medium text-amber-900 bg-amber-100/80 hover:bg-amber-200 px-2.5 py-1 rounded-lg border border-amber-300 transition-colors shrink-0"
            title={t.readAloud}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t.readAloud}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 mt-2 leading-relaxed font-medium">
          {t.todayTipText}
        </p>
      </div>

      {/* Kisan Helpline Toll Free Card */}
      <div className="bg-emerald-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <p className="text-xs text-emerald-200 font-medium">
              {language === 'ta' ? 'அரசு உதவி எண்' : 'National Farmer Support'}
            </p>
            <p className="text-sm font-bold text-white tracking-wide">
              {t.kisanCallCenter}
            </p>
          </div>
        </div>

        <a
          href="tel:18001801551"
          className="inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-emerald-700 transition-colors text-center"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'அழைக்கவும்' : 'Call 1800-180-1551'}</span>
        </a>
      </div>
    </div>
  );
};
