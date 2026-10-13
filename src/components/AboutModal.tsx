import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import {
  X,
  Info,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  PhoneCall,
  Wifi,
  WifiOff,
  Sparkles,
  Database,
  Mic,
  BookOpen,
  Award,
} from 'lucide-react';

interface AboutModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => Promise<void>;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  language,
  isOpen,
  onClose,
  onResetData,
}) => {
  const t = translations[language];
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!isOpen) return null;

  const handleConfirmReset = async () => {
    setIsResetting(true);
    await onResetData();
    setIsResetting(false);
    setShowConfirmReset(false);
    onClose();
  };

  const featureMatrix = [
    {
      feature: language === 'ta' ? 'வட்டார பயிர் வழிகாட்டி (5 பயிர்கள்)' : 'Regional Crop Guide (5 Crops)',
      mode: 'Offline',
      icon: <BookOpen className="w-4 h-4 text-emerald-700" />,
      how: language === 'ta' ? '100% ஆஃப்லைன். பயன்பாட்டு தொகுப்பில் முன்கூட்டியே ஏற்றப்பட்டுள்ளது.' : '100% Offline. Preloaded in local bundle.',
    },
    {
      feature: language === 'ta' ? 'ஆஃப்லைன் அறிவு வழிகாட்டி & தேடல்' : 'Offline Farming Guide & Search',
      mode: 'Offline',
      icon: <Database className="w-4 h-4 text-emerald-700" />,
      how: language === 'ta' ? '100% ஆஃப்லைன். உலாவி மூலம் உடனடி தேடல்.' : '100% Offline. Instant client-side indexing.',
    },
    {
      feature: language === 'ta' ? 'வயல் குரல் பதிவுகள் (Voice Notes)' : 'Field Voice Notes (Audio Memos)',
      mode: 'Offline',
      icon: <Mic className="w-4 h-4 text-emerald-700" />,
      how: language === 'ta' ? '100% ஆஃப்லைன். MediaRecorder & IndexedDB-யில் சேமிக்கப்படுகிறது.' : '100% Offline. Recorded via browser MediaRecorder & stored in IndexedDB.',
    },
    {
      feature: language === 'ta' ? 'விருப்பமான குறிப்புகள் சேமிப்பு' : 'Saved Favorite Tips & Bookmarks',
      mode: 'Offline',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
      how: language === 'ta' ? 'உலாவியின் localStorage-ல் சேமிக்கப்படுகிறது.' : 'Persisted locally in browser localStorage.',
    },
    {
      feature: language === 'ta' ? 'AI உதவியாளர் (நேரலை முறை)' : 'AI Farming Assistant (Live Mode)',
      mode: 'Online',
      icon: <Sparkles className="w-4 h-4 text-blue-600" />,
      how: language === 'ta' ? 'இணையம் தேவை. பாதுகாப்பான சர்வர் வழியாக கூகிள் ஜெமினி 3.8 Flash அழைப்பு.' : 'Requires Internet. Proxied server-side to Google Gemini 3.8 Flash.',
    },
    {
      feature: language === 'ta' ? 'AI உதவியாளர் (ஆஃப்லைன் பின்னடைவு)' : 'AI Farming Assistant (Offline Mode)',
      mode: 'Offline',
      icon: <Database className="w-4 h-4 text-emerald-700" />,
      how: language === 'ta' ? 'இணையம் இல்லாத போது உள்ளூர் அறிவுத்தளம் மூலம் தானாக பதில்.' : 'Zero internet fallback automatically matches query to preloaded knowledge.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-emerald-100 shadow-2xl p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                {t.aboutTitle}
              </h3>
              <p className="text-xs text-slate-500">{t.aboutSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Context */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-700">
          <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-700" />
            <span>{t.projectObjective}</span>
          </h4>
          <p className="leading-relaxed bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
            {t.projectObjectiveText}
          </p>
        </div>

        {/* Feature Matrix Table */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
            {t.featureComparison}
          </h4>
          <div className="border border-emerald-100 rounded-2xl overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-slate-100/90 font-bold text-slate-700 p-2.5">
              <div className="col-span-5">{t.featureName}</div>
              <div className="col-span-3">{t.featureMode}</div>
              <div className="col-span-4">{t.featureExplanation}</div>
            </div>
            <div className="divide-y divide-slate-100">
              {featureMatrix.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 p-2.5 items-center gap-1">
                  <div className="col-span-5 font-medium text-slate-900 flex items-center gap-1.5">
                    {item.icon}
                    <span className="line-clamp-1">{item.feature}</span>
                  </div>
                  <div className="col-span-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block ${
                        item.mode === 'Offline'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {item.mode}
                    </span>
                  </div>
                  <div className="col-span-4 text-slate-500 text-[11px] leading-tight">
                    {item.how}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Helpline Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-amber-950 block">
              {language === 'ta' ? 'அரசு விவசாய ஆலோசனை மையம்' : 'National Kisan Call Centre'}
            </span>
            <span className="text-amber-800 font-mono font-semibold">
              1800-180-1551 (Toll Free, 6 AM - 10 PM)
            </span>
          </div>
          <a
            href="tel:18001801551"
            className="bg-amber-700 text-white px-3 py-1.5 rounded-xl font-semibold hover:bg-amber-800 transition-colors"
          >
            {language === 'ta' ? 'அழைக்க' : 'Call'}
          </a>
        </div>

        {/* Reset Demo State Section */}
        <div className="pt-2 border-t border-slate-100">
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-xs text-red-700 hover:text-red-900 flex items-center gap-1.5 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetDemoData}</span>
            </button>
          ) : (
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 space-y-2.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>{t.resetDemoData}</span>
              </div>
              <p className="text-xs text-red-800">{t.resetWarning}</p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleConfirmReset}
                  disabled={isResetting}
                  className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isResetting ? 'Resetting...' : t.confirmReset}
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
