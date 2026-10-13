import React, { useState, useMemo } from 'react';
import { FarmingTip, Language } from '../types';
import { OFFLINE_TIPS } from '../data/offlineTipsData';
import { translations } from '../utils/translations';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Volume2,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Tag,
  Sparkles,
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface OfflineGuideProps {
  language: Language;
  bookmarkedTipIds: string[];
  onToggleBookmarkTip: (tipId: string) => void;
  onStartSpeaking: () => void;
  onStopSpeaking: () => void;
}

export const OfflineGuide: React.FC<OfflineGuideProps> = ({
  language,
  bookmarkedTipIds,
  onToggleBookmarkTip,
  onStartSpeaking,
  onStopSpeaking,
}) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: t.allCategories },
    { id: 'soil', label: t.catSoil },
    { id: 'pest', label: t.catPest },
    { id: 'water', label: t.catWater },
    { id: 'organic', label: t.catOrganic },
    { id: 'harvest', label: t.catHarvest },
  ];

  const filteredTips = useMemo(() => {
    return OFFLINE_TIPS.filter((tip) => {
      // Category match
      if (selectedCategory !== 'all' && tip.category !== selectedCategory) {
        return false;
      }

      // Bookmark filter
      if (showOnlyBookmarks && !bookmarkedTipIds.includes(tip.id)) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle =
          tip.titleEn.toLowerCase().includes(q) ||
          tip.titleTa.toLowerCase().includes(q);
        const inSummary =
          tip.summaryEn.toLowerCase().includes(q) ||
          tip.summaryTa.toLowerCase().includes(q);
        const inTags = tip.cropTags.some((tag) => tag.toLowerCase().includes(q));
        const inSteps =
          tip.stepsEn.some((s) => s.toLowerCase().includes(q)) ||
          tip.stepsTa.some((s) => s.toLowerCase().includes(q));

        if (!inTitle && !inSummary && !inTags && !inSteps) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, showOnlyBookmarks, bookmarkedTipIds]);

  const toggleExpand = (id: string) => {
    setExpandedTipId((prev) => (prev === id ? null : id));
  };

  const handleReadTip = (tip: FarmingTip) => {
    onStartSpeaking();
    const title = language === 'ta' ? tip.titleTa : tip.titleEn;
    const summary = language === 'ta' ? tip.summaryTa : tip.summaryEn;
    const steps = (language === 'ta' ? tip.stepsTa : tip.stepsEn).join('. ');
    speakText(`${title}. ${summary}. ${steps}`, language, () => onStopSpeaking());
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-800" />
          <span>{t.offlineTitle}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t.offlineSubtitle}
        </p>
      </div>

      {/* Offline Status Badge */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-950 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{t.offlineReady}</span>
          <span className="hidden sm:inline text-emerald-700 font-normal">
            &bull; {language === 'ta' ? 'அனைத்து தகவல்களும் ஆஃப்லைனில் உடனடியாகத் திறக்கும்' : 'All data preloaded into app bundle'}
          </span>
        </div>

        <button
          onClick={() => setShowOnlyBookmarks((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold transition-colors ${
            showOnlyBookmarks
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-white text-slate-700 border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          {showOnlyBookmarks ? (
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-700" />
          ) : (
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
          )}
          <span>{t.showFavoritesOnly}</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full text-xs sm:text-sm bg-white border border-emerald-200 rounded-2xl pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            &times;
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all active:scale-95 snap-start ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                  : 'bg-white text-slate-700 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tips Cards List */}
      <div className="space-y-3.5">
        {filteredTips.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-emerald-100 text-center space-y-2">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {t.noTipsFound}
            </p>
          </div>
        ) : (
          filteredTips.map((tip) => {
            const isExpanded = expandedTipId === tip.id;
            const isBookmarked = bookmarkedTipIds.includes(tip.id);

            return (
              <div
                key={tip.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-2xs space-y-3 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {tip.category}
                      </span>
                      {tip.cropTags.map((crop) => (
                        <span
                          key={crop}
                          className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>

                    <h3
                      onClick={() => toggleExpand(tip.id)}
                      className="text-sm sm:text-base font-bold text-slate-900 cursor-pointer hover:text-emerald-800 transition-colors"
                    >
                      {language === 'ta' ? tip.titleTa : tip.titleEn}
                    </h3>
                  </div>

                  {/* Bookmark & Read Aloud Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleReadTip(tip)}
                      className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-xl transition-colors"
                      title={t.readAloud}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onToggleBookmarkTip(tip.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isBookmarked
                          ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title={t.bookmarkTip}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-700" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {language === 'ta' ? tip.summaryTa : tip.summaryEn}
                </p>

                {/* Expand / Collapse Button */}
                <button
                  onClick={() => toggleExpand(tip.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 pt-1"
                >
                  <span>{isExpanded ? (language === 'ta' ? 'சுருக்கவும்' : 'Show Less') : t.stepsToFollow}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3 animate-fadeIn text-xs sm:text-sm">
                    <div className="space-y-2">
                      <span className="font-bold text-slate-800 block text-xs">
                        {t.stepsToFollow}:
                      </span>
                      <div className="space-y-1.5">
                        {(language === 'ta' ? tip.stepsTa : tip.stepsEn).map((step, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-slate-700 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
                      <span className="font-bold text-amber-950 block text-xs mb-1">
                        🔬 {t.expertAdvice}:
                      </span>
                      <p className="text-amber-900 leading-relaxed text-xs">
                        {language === 'ta' ? tip.expertNoteTa : tip.expertNoteEn}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
