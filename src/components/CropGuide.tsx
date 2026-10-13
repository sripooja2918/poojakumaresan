import React, { useState } from 'react';
import { Crop, Language } from '../types';
import { CROPS_DATA } from '../data/cropsData';
import { translations } from '../utils/translations';
import {
  Sprout,
  Droplets,
  Calendar,
  Layers,
  Bug,
  Leaf,
  Volume2,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface CropGuideProps {
  language: Language;
  bookmarkedCropIds: string[];
  onToggleBookmarkCrop: (cropId: string) => void;
  onStartSpeaking: () => void;
  onStopSpeaking: () => void;
}

export const CropGuide: React.FC<CropGuideProps> = ({
  language,
  bookmarkedCropIds,
  onToggleBookmarkCrop,
  onStartSpeaking,
  onStopSpeaking,
}) => {
  const t = translations[language];
  const [selectedCropId, setSelectedCropId] = useState<string>('paddy');
  const [activeTab, setActiveTab] = useState<'overview' | 'watering' | 'practices' | 'pests' | 'organic'>('overview');

  const selectedCrop = CROPS_DATA.find((c) => c.id === selectedCropId) || CROPS_DATA[0];
  const isBookmarked = bookmarkedCropIds.includes(selectedCrop.id);

  const handleReadSummary = () => {
    onStartSpeaking();
    const textToSpeak = language === 'ta'
      ? `${selectedCrop.nameTa}. ${selectedCrop.summaryTa}. வளர்ச்சி காலம்: ${selectedCrop.durationDays}. மண்: ${selectedCrop.growingConditions.soilTa}`
      : `${selectedCrop.nameEn}. ${selectedCrop.summaryEn}. Duration: ${selectedCrop.durationDays}. Soil: ${selectedCrop.growingConditions.soilEn}`;
    speakText(textToSpeak, language, () => onStopSpeaking());
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sprout className="w-6 h-6 text-emerald-800" />
          <span>{t.cropGuideTitle}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t.cropGuideSubtitle}
        </p>
      </div>

      {/* Horizontal Crop Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
        {CROPS_DATA.map((crop) => {
          const isSelected = crop.id === selectedCropId;
          const isMarked = bookmarkedCropIds.includes(crop.id);
          return (
            <button
              key={crop.id}
              onClick={() => {
                setSelectedCropId(crop.id);
                setActiveTab('overview');
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold shrink-0 transition-all active:scale-95 snap-start ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-white text-slate-700 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <span className="text-lg">{crop.icon}</span>
              <span>{language === 'ta' ? crop.nameTa : crop.nameEn}</span>
              {isMarked && (
                <BookmarkCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Crop Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-5">
        {/* Crop Hero Top */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shrink-0">
              {selectedCrop.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {language === 'ta' ? selectedCrop.nameTa : selectedCrop.nameEn}
                </h3>
                <span className="text-xs bg-emerald-50 text-emerald-800 font-medium px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {language === 'ta' ? selectedCrop.badgeTa : selectedCrop.badgeEn}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 italic mt-0.5">
                {selectedCrop.botanicalName} &bull; {selectedCrop.durationDays}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleReadSummary}
              className="flex items-center gap-1.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-2 rounded-xl transition-colors active:scale-95"
              title={t.readAloud}
            >
              <Volume2 className="w-4 h-4 text-emerald-800" />
              <span>{t.readAloud}</span>
            </button>

            <button
              onClick={() => onToggleBookmarkCrop(selectedCrop.id)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border transition-colors active:scale-95 ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-700" />
                  <span>{t.bookmarked}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-slate-600" />
                  <span>{t.bookmarkTip}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Description */}
        <p className="text-sm text-slate-700 leading-relaxed font-normal bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100">
          {language === 'ta' ? selectedCrop.summaryTa : selectedCrop.summaryEn}
        </p>

        {/* Inner Tabs for Detailed Crop Sections */}
        <div className="flex gap-1.5 p-1 bg-slate-100/90 rounded-2xl overflow-x-auto">
          {[
            { id: 'overview', label: t.growingConditions, icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'watering', label: t.wateringGuide, icon: <Droplets className="w-3.5 h-3.5" /> },
            { id: 'practices', label: t.farmingPractices, icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'pests', label: t.pestsAndDiseases, icon: <Bug className="w-3.5 h-3.5" /> },
            { id: 'organic', label: t.organicTips, icon: <Leaf className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Growing Conditions */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-sm animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {language === 'ta' ? 'உகந்த மண்' : 'Ideal Soil'}
                </span>
                <p className="font-medium text-slate-800 text-xs sm:text-sm">
                  {language === 'ta' ? selectedCrop.growingConditions.soilTa : selectedCrop.growingConditions.soilEn}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {language === 'ta' ? 'தட்பவெப்ப நிலை' : 'Temperature'}
                </span>
                <p className="font-medium text-slate-800 text-xs sm:text-sm">
                  {language === 'ta' ? selectedCrop.growingConditions.tempTa : selectedCrop.growingConditions.tempEn}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {language === 'ta' ? 'மழை அளவு / பாசனம்' : 'Rainfall & Water'}
                </span>
                <p className="font-medium text-slate-800 text-xs sm:text-sm">
                  {language === 'ta' ? selectedCrop.growingConditions.rainfallTa : selectedCrop.growingConditions.rainfallEn}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {language === 'ta' ? 'பருவம்' : 'Sowing Season'}
                </span>
                <p className="font-medium text-slate-800 text-xs sm:text-sm">
                  {language === 'ta' ? selectedCrop.growingConditions.seasonTa : selectedCrop.growingConditions.seasonEn}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Watering Guide */}
        {activeTab === 'watering' && (
          <div className="space-y-4 text-sm animate-fadeIn">
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-bold">
                <Droplets className="w-5 h-5 text-blue-700" />
                <span>{language === 'ta' ? 'பாசன அட்டவணை' : 'Irrigation Schedule'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {language === 'ta' ? selectedCrop.watering.scheduleTa : selectedCrop.watering.scheduleEn}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {t.criticalStages}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(language === 'ta' ? selectedCrop.watering.criticalStagesTa : selectedCrop.watering.criticalStagesEn).map(
                  (stage, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{stage}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-950 block mb-1">
                {language === 'ta' ? 'நீர் சேமிப்பு தொழில்நுட்பம்:' : 'Water Conservation Method:'}
              </span>
              <p className="text-xs sm:text-sm text-emerald-900">
                {language === 'ta' ? selectedCrop.watering.waterSavingMethodTa : selectedCrop.watering.waterSavingMethodEn}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Farming Practices */}
        {activeTab === 'practices' && (
          <div className="space-y-3 text-sm animate-fadeIn">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-emerald-900 block mb-1">
                {t.landPrep}
              </span>
              <p className="text-xs sm:text-sm text-slate-700">
                {language === 'ta' ? selectedCrop.practices.landPrepTa : selectedCrop.practices.landPrepEn}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-emerald-900 block mb-1">
                {t.seedTreatment}
              </span>
              <p className="text-xs sm:text-sm text-slate-700">
                {language === 'ta' ? selectedCrop.practices.seedTreatmentTa : selectedCrop.practices.seedTreatmentEn}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-emerald-900 block mb-1">
                {t.spacing}
              </span>
              <p className="text-xs sm:text-sm text-slate-700">
                {language === 'ta' ? selectedCrop.practices.spacingTa : selectedCrop.practices.spacingEn}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-emerald-900 block mb-1">
                {t.fertilizerDose}
              </span>
              <p className="text-xs sm:text-sm text-slate-700">
                {language === 'ta' ? selectedCrop.practices.fertilizerScheduleTa : selectedCrop.practices.fertilizerScheduleEn}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-emerald-900 block mb-1">
                {t.harvesting}
              </span>
              <p className="text-xs sm:text-sm text-slate-700">
                {language === 'ta' ? selectedCrop.practices.harvestingTa : selectedCrop.practices.harvestingEn}
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Pests & Diseases */}
        {activeTab === 'pests' && (
          <div className="space-y-4 text-sm animate-fadeIn">
            {selectedCrop.pests.map((pest, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Bug className="w-5 h-5 text-red-600" />
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {language === 'ta' ? pest.pestTa : pest.pestEn}
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-slate-700">{t.symptoms}: </span>
                    <span className="text-slate-600">
                      {language === 'ta' ? pest.symptomsTa : pest.symptomsEn}
                    </span>
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <span className="font-semibold text-emerald-900 block text-xs">
                      {t.organicSol}:
                    </span>
                    <p className="text-emerald-800 text-xs">
                      {language === 'ta' ? pest.organicSolutionTa : pest.organicSolutionEn}
                    </p>
                  </div>

                  <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200">
                    <span className="font-semibold text-amber-950 block text-xs">
                      {t.chemicalSol}:
                    </span>
                    <p className="text-amber-900 text-xs">
                      {language === 'ta' ? pest.chemicalControlTa : pest.chemicalControlEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Organic Tips */}
        {activeTab === 'organic' && (
          <div className="space-y-3 text-sm animate-fadeIn">
            {(language === 'ta' ? selectedCrop.organicTipsTa : selectedCrop.organicTipsEn).map(
              (tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs sm:text-sm text-slate-800"
                >
                  <Leaf className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{tip}</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
