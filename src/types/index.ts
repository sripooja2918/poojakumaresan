export type Language = 'en' | 'ta' | 'tanglish';

export interface GrowingConditions {
  soilEn: string;
  soilTa: string;
  tempEn: string;
  tempTa: string;
  rainfallEn: string;
  rainfallTa: string;
  seasonEn: string;
  seasonTa: string;
}

export interface WateringGuide {
  scheduleEn: string;
  scheduleTa: string;
  criticalStagesEn: string[];
  criticalStagesTa: string[];
  waterSavingMethodEn: string;
  waterSavingMethodTa: string;
}

export interface FarmingPractices {
  landPrepEn: string;
  landPrepTa: string;
  seedTreatmentEn: string;
  seedTreatmentTa: string;
  spacingEn: string;
  spacingTa: string;
  fertilizerScheduleEn: string;
  fertilizerScheduleTa: string;
  harvestingEn: string;
  harvestingTa: string;
}

export interface PestInfo {
  pestEn: string;
  pestTa: string;
  symptomsEn: string;
  symptomsTa: string;
  organicSolutionEn: string;
  organicSolutionTa: string;
  chemicalControlEn: string;
  chemicalControlTa: string;
}

export interface Crop {
  id: string;
  nameEn: string;
  nameTa: string;
  botanicalName: string;
  durationDays: string;
  category: 'cereal' | 'commercial' | 'plantation' | 'vegetable';
  icon: string;
  badgeEn: string;
  badgeTa: string;
  summaryEn: string;
  summaryTa: string;
  growingConditions: GrowingConditions;
  watering: WateringGuide;
  practices: FarmingPractices;
  pests: PestInfo[];
  organicTipsEn: string[];
  organicTipsTa: string[];
}

export interface FarmingTip {
  id: string;
  category: 'soil' | 'pest' | 'water' | 'organic' | 'harvest';
  titleEn: string;
  titleTa: string;
  summaryEn: string;
  summaryTa: string;
  stepsEn: string[];
  stepsTa: string[];
  cropTags: string[];
  expertNoteEn: string;
  expertNoteTa: string;
  isBookmarked?: boolean;
}

export interface VoiceNoteRecord {
  id: string;
  title: string;
  cropTag: string;
  recordedAt: number;
  durationSeconds: number;
  audioBlobUrl?: string;
  audioDataSize?: number;
  noteDescription?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  isFallback?: boolean;
  source?: 'gemini-live' | 'preloaded-knowledge';
}

export interface PreloadedQA {
  id: string;
  keywords: string[];
  cropTag?: string;
  questionEn: string;
  questionTa: string;
  questionTanglish?: string;
  answerEn: string;
  answerTa: string;
  answerTanglish?: string;
}
