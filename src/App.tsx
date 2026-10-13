import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { CropGuide } from './components/CropGuide';
import { AIAssistant } from './components/AIAssistant';
import { VoiceNotes } from './components/VoiceNotes';
import { OfflineGuide } from './components/OfflineGuide';
import { AboutModal } from './components/AboutModal';
import { clearAllAudioRecords } from './utils/audioStorage';

const LANG_STORAGE_KEY = 'agrisaarthi_lang';
const BOOKMARKED_TIPS_KEY = 'agrisaarthi_bookmarked_tips';
const BOOKMARKED_CROPS_KEY = 'agrisaarthi_bookmarked_crops';

export default function App() {
  // 1. Language state
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'ta' || saved === 'en' || saved === 'tanglish') return saved;
    } catch {
      // default
    }
    return 'ta';
  });

  // 2. Active Tab state
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // 3. Online/Offline detection
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // 4. Bookmarks state
  const [bookmarkedTipIds, setBookmarkedTipIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKED_TIPS_KEY);
      return stored ? JSON.parse(stored) : ['tip-soil-panchagavya', 'tip-pest-neem-extract'];
    } catch {
      return ['tip-soil-panchagavya'];
    }
  });

  const [bookmarkedCropIds, setBookmarkedCropIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKED_CROPS_KEY);
      return stored ? JSON.parse(stored) : ['paddy'];
    } catch {
      return ['paddy'];
    }
  });

  // 5. Speech active state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [pendingAIQuestion, setPendingAIQuestion] = useState<string>('');

  // 6. About Modal
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Listen to network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync language to localStorage
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Could not save language to localStorage:', e);
    }
  };

  // Toggle tip bookmark
  const handleToggleBookmarkTip = (tipId: string) => {
    setBookmarkedTipIds((prev) => {
      const updated = prev.includes(tipId)
        ? prev.filter((id) => id !== tipId)
        : [...prev, tipId];
      try {
        localStorage.setItem(BOOKMARKED_TIPS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update bookmarks:', e);
      }
      return updated;
    });
  };

  // Toggle crop bookmark
  const handleToggleBookmarkCrop = (cropId: string) => {
    setBookmarkedCropIds((prev) => {
      const updated = prev.includes(cropId)
        ? prev.filter((id) => id !== cropId)
        : [...prev, cropId];
      try {
        localStorage.setItem(BOOKMARKED_CROPS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update crop bookmarks:', e);
      }
      return updated;
    });
  };

  // Reset Demo Data
  const handleResetDemoData = async () => {
    try {
      localStorage.removeItem(BOOKMARKED_TIPS_KEY);
      localStorage.removeItem(BOOKMARKED_CROPS_KEY);
      localStorage.removeItem('agrisaarthi_chat_history');
      await clearAllAudioRecords();

      setBookmarkedTipIds(['tip-soil-panchagavya']);
      setBookmarkedCropIds(['paddy']);
      setActiveTab('home');
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 text-slate-900 flex flex-col font-sans pb-20">
      {/* Top Navbar */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        isOnline={isOnline}
        onOpenAbout={() => setIsAboutOpen(true)}
        isSpeaking={isSpeaking}
        onStopSpeaking={() => setIsSpeaking(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-4 sm:pt-6">
        {activeTab === 'home' && (
          <HomeDashboard
            language={language}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isOnline={isOnline}
            onStartSpeaking={() => setIsSpeaking(true)}
            onStopSpeaking={() => setIsSpeaking(false)}
          />
        )}

        {activeTab === 'crops' && (
          <CropGuide
            language={language}
            bookmarkedCropIds={bookmarkedCropIds}
            onToggleBookmarkCrop={handleToggleBookmarkCrop}
            onStartSpeaking={() => setIsSpeaking(true)}
            onStopSpeaking={() => setIsSpeaking(false)}
          />
        )}

        {activeTab === 'ai' && (
          <AIAssistant
            language={language}
            isOnline={isOnline}
            onStartSpeaking={() => setIsSpeaking(true)}
            onStopSpeaking={() => setIsSpeaking(false)}
            initialQuestion={pendingAIQuestion}
          />
        )}

        {activeTab === 'voice' && (
          <VoiceNotes
            language={language}
            onAskAI={(question) => {
              setPendingAIQuestion(question);
              setActiveTab('ai');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'offline' && (
          <OfflineGuide
            language={language}
            bookmarkedTipIds={bookmarkedTipIds}
            onToggleBookmarkTip={handleToggleBookmarkTip}
            onStartSpeaking={() => setIsSpeaking(true)}
            onStopSpeaking={() => setIsSpeaking(false)}
          />
        )}
      </main>

      {/* Mobile-First Sticky Bottom Nav */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
      />

      {/* About & Hackathon Modal */}
      <AboutModal
        language={language}
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onResetData={handleResetDemoData}
      />
    </div>
  );
}
