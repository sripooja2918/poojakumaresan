import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language } from '../types';
import { translations } from '../utils/translations';
import { PRELOADED_QA } from '../data/preloadedQA';
import { getSmartAgriculturalResponse } from '../utils/answerMatcher';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Headphones,
  CheckCircle,
  Radio,
} from 'lucide-react';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  speakText,
  stopSpeaking,
} from '../utils/speech';

interface AIAssistantProps {
  language: Language;
  isOnline: boolean;
  onStartSpeaking: () => void;
  onStopSpeaking: () => void;
  initialQuestion?: string;
}

const CHAT_STORAGE_KEY = 'agrisaarthi_chat_history';
const AUTO_VOICE_STORAGE_KEY = 'agrisaarthi_auto_voice';

export const AIAssistant: React.FC<AIAssistantProps> = ({
  language,
  isOnline,
  onStartSpeaking,
  onStopSpeaking,
  initialQuestion,
}) => {
  const t = translations[language];

  // Auto Voice Mode is enabled by default to help farmers who cannot read/write
  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(AUTO_VOICE_STORAGE_KEY);
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Chat history read error:', e);
    }
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text:
          language === 'tanglish'
            ? 'Vanakkam! Naan AgriSaarthi AI. Ezhudha theriyala na kooda paravaala, mic button azhuthi kural-la pesi kelunga. Naan kural-laye bathil solven! (eg: thakkali chedi vadiruchu enna pannradhu?).'
            : language === 'ta'
            ? 'வணக்கம்! நான் அக்ரிசாரதி AI. எழுத, படிக்க சிரமமாக இருந்தாலும் பரவாயில்லை, கீழே உள்ள மைக் பட்டனை அழுத்தி தமிழில் பேசுங்கள். நான் குரலிலேயே பதில் கூறுவேன்!'
            : 'Welcome to AgriSaarthi AI! Tap the microphone button to ask questions by voice, and I will speak the answer aloud for you.',
        timestamp: Date.now(),
        source: 'preloaded-knowledge',
      },
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognizerRef = useRef<any>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat to localStorage:', e);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle initial question from external components (e.g., Voice Notes)
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      handleSendMessage(initialQuestion.trim());
    }
  }, [initialQuestion]);

  const toggleAutoVoice = () => {
    setAutoVoiceEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(AUTO_VOICE_STORAGE_KEY, String(next));
      } catch (e) {
        // ignore
      }
      if (!next) {
        stopSpeaking();
        setSpeakingMessageId(null);
        onStopSpeaking();
      }
      return next;
    });
  };

  // Example suggested questions with Thanglish support
  const suggestedQuestions = PRELOADED_QA.map((qa) => ({
    id: qa.id,
    text:
      language === 'tanglish'
        ? qa.questionTanglish || qa.questionEn
        : language === 'ta'
        ? qa.questionTa
        : qa.questionEn,
  }));

  // Handle Speech-to-Text
  const handleToggleVoiceInput = () => {
    setSpeechError(null);
    if (!isSpeechRecognitionSupported()) {
      setSpeechError(t.speechNotSupported);
      return;
    }

    if (isListening) {
      speechRecognizerRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Stop ongoing speech before listening
    stopSpeaking();
    setSpeakingMessageId(null);
    onStopSpeaking();

    const recognizer = createSpeechRecognizer(
      language,
      (transcript) => {
        setIsListening(false);
        // Automatically send the voice question directly!
        if (transcript.trim()) {
          handleSendMessage(transcript.trim());
        }
      },
      (err) => {
        setSpeechError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      speechRecognizerRef.current = recognizer;
      recognizer.start();
      setIsListening(true);
    } else {
      setSpeechError(t.speechNotSupported);
    }
  };

  const handleReadMessage = (text: string, msgId: string) => {
    if (speakingMessageId === msgId) {
      // Toggle off
      stopSpeaking();
      setSpeakingMessageId(null);
      onStopSpeaking();
      return;
    }

    stopSpeaking();
    setSpeakingMessageId(msgId);
    onStartSpeaking();

    speakText(text, language, () => {
      setSpeakingMessageId(null);
      onStopSpeaking();
    });
  };

  const handleStopAllSpeaking = () => {
    stopSpeaking();
    setSpeakingMessageId(null);
    onStopSpeaking();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);
    setSpeechError(null);

    // Call server API or fallback
    try {
      let assistantReply = '';
      let replySource: 'gemini-live' | 'preloaded-knowledge' = 'gemini-live';
      let isFallback = false;

      if (!isOnline) {
        // Direct offline response
        const fallback = getSmartAgriculturalResponse(query, language);
        assistantReply = fallback.reply;
        replySource = 'preloaded-knowledge';
        isFallback = true;
      } else {
        const historyPayload = messages.slice(-4).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }));

        const response = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: query,
            language,
            history: historyPayload,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.reply) {
          assistantReply = data.reply;
          replySource = 'gemini-live';
        } else {
          // Fallback needed according to server response
          const fallback = getSmartAgriculturalResponse(query, language);
          assistantReply = fallback.reply;
          replySource = 'preloaded-knowledge';
          isFallback = true;
        }
      }

      const newAssistantId = `a-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: newAssistantId,
        sender: 'assistant',
        text: assistantReply,
        timestamp: Date.now(),
        source: replySource,
        isFallback,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If Auto-Voice is enabled, immediately speak the answer aloud in Tamil / Thanglish!
      if (autoVoiceEnabled) {
        handleReadMessage(assistantReply, newAssistantId);
      }
    } catch (err) {
      console.warn('Network or Gemini API error, serving preloaded knowledge:', err);
      const fallback = getSmartAgriculturalResponse(query, language);
      const newAssistantId = `a-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: newAssistantId,
        sender: 'assistant',
        text: fallback.reply,
        timestamp: Date.now(),
        source: 'preloaded-knowledge',
        isFallback: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (autoVoiceEnabled) {
        handleReadMessage(fallback.reply, newAssistantId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    handleStopAllSpeaking();
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text:
          language === 'tanglish'
            ? 'Chat history clear aaiduchu. Mic button azhuthi kural-la pesi pudhiya kelviya kelunga.'
            : language === 'ta'
            ? 'அரட்டை வரலாறு நீக்கப்பட்டது. மைக் பட்டனை அழுத்தி புதிய கேள்வியை பேசிக் கேட்கலாம்.'
            : 'Chat history cleared. Please tap the mic button to ask a new agricultural question.',
        timestamp: Date.now(),
        source: 'preloaded-knowledge',
      },
    ]);
  };

  return (
    <div className="space-y-3 pb-8 flex flex-col h-[calc(100vh-160px)] max-h-[850px]">
      {/* Title & Auto-Voice Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-emerald-800" />
            <span>{t.aiTitle}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isOnline ? t.aiPoweredBy : t.offlineReady}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto Voice Mode Toggle */}
          <button
            onClick={toggleAutoVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              autoVoiceEnabled
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Auto-speak AI responses aloud in Tamil"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>
              {language === 'ta'
                ? 'குரல் வாசிப்பு: ஆன்'
                : language === 'tanglish'
                ? 'Auto Voice: ON'
                : 'Auto Voice: ON'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                autoVoiceEnabled ? 'bg-emerald-300 animate-pulse' : 'bg-slate-300'
              }`}
            />
          </button>

          <button
            onClick={handleClearChat}
            className="text-xs text-slate-500 hover:text-red-700 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-1 transition-colors"
            title={t.clearChat}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Speaking Indicator Banner */}
      {speakingMessageId && (
        <div className="bg-amber-100 border border-amber-300 rounded-2xl p-2.5 px-3.5 flex items-center justify-between gap-2 text-xs text-amber-950 animate-pulse shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1 items-end h-4">
              <span className="w-1 h-2 bg-amber-700 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-3.5 bg-amber-700 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-2.5 bg-amber-700 rounded-full animate-bounce"></span>
            </div>
            <span className="font-bold">
              {language === 'ta'
                ? 'AI பதில் குரலில் ஒலிக்கிறது... கவனமாகக் கேளுங்கள்'
                : language === 'tanglish'
                ? 'AI kural-la bathil solludhu... Kelinga'
                : 'AI is speaking the response aloud...'}
            </span>
          </div>
          <button
            onClick={handleStopAllSpeaking}
            className="bg-amber-800 hover:bg-amber-900 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-colors"
          >
            <VolumeX className="w-3 h-3" />
            <span>{t.stopSpeaking}</span>
          </button>
        </div>
      )}

      {/* Suggested Questions Carousel */}
      <div className="shrink-0 space-y-1">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          {t.exampleQuestions}:
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x">
          {suggestedQuestions.map((sq) => (
            <button
              key={sq.id}
              onClick={() => handleSendMessage(sq.text)}
              className="text-xs font-medium text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shrink-0 transition-colors shadow-2xs snap-start text-left"
            >
              {sq.text}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto bg-slate-50/70 rounded-3xl p-3 sm:p-4 border border-emerald-100 space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isThisSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                  isUser
                    ? 'bg-emerald-800 text-white rounded-br-xs'
                    : isThisSpeaking
                    ? 'bg-white text-slate-900 border-2 border-emerald-600 rounded-bl-xs ring-2 ring-emerald-200'
                    : 'bg-white text-slate-800 border border-emerald-100 rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 text-[11px] font-medium">
                    <span className="flex items-center gap-1">
                      {msg.source === 'gemini-live' ? (
                        <span className="text-blue-700 flex items-center gap-1 font-semibold">
                          <Sparkles className="w-3.5 h-3.5" />
                          Gemini 3.8 Flash
                        </span>
                      ) : (
                        <span className="text-emerald-800 flex items-center gap-1 font-semibold">
                          <BookOpen className="w-3.5 h-3.5" />
                          {language === 'tanglish'
                            ? 'Verified Agri Hub'
                            : language === 'ta'
                            ? 'சரிபார்க்கப்பட்ட வேளாண் அறிவு'
                            : 'Verified Agronomy Hub'}
                        </span>
                      )}
                    </span>

                    {/* Prominent Voice Speaker Button */}
                    <button
                      onClick={() => handleReadMessage(msg.text, msg.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        isThisSpeaking
                          ? 'bg-emerald-800 text-white animate-pulse'
                          : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                      title={isThisSpeaking ? t.stopSpeaking : t.readAloud}
                    >
                      {isThisSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>{t.stopSpeaking}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-800" />
                          <span>
                            {language === 'ta'
                              ? 'குரலில் கேட்க'
                              : language === 'tanglish'
                              ? 'Kural-la Kekkalam'
                              : 'Listen'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div>{msg.text}</div>
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-white border border-emerald-100 rounded-2xl p-3.5 shadow-2xs flex items-center gap-2 text-xs text-slate-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
              </div>
              <span>
                {language === 'ta'
                  ? 'பதில் தயாராகிறது... குரலில் வாசிக்கப்படும்'
                  : language === 'tanglish'
                  ? 'Bathil thayaraagudhu... Kural-la sollappadum'
                  : 'Preparing answer... will speak aloud'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Disclaimer note */}
      <div className="shrink-0 flex items-start gap-1.5 px-2 text-[11px] text-slate-500">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <p className="line-clamp-1">{t.aiDisclaimer}</p>
      </div>

      {/* Speech error notification if any */}
      {speechError && (
        <div className="shrink-0 bg-red-50 text-red-800 text-xs px-3 py-2 rounded-xl border border-red-200 flex items-center justify-between">
          <span>{speechError}</span>
          <button onClick={() => setSpeechError(null)} className="text-red-900 font-bold ml-2">
            &times;
          </button>
        </div>
      )}

      {/* Large Voice Action Banner For Illiterate Farmers */}
      <div className="shrink-0 bg-emerald-800 text-white rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-white">
              {isListening
                ? language === 'ta'
                  ? 'உங்கள் குரலைக் கேட்கிறது... பேசுங்கள்'
                  : language === 'tanglish'
                  ? 'Ungal kural-ai ketkudhu... Pesunga'
                  : 'Listening to your voice...'
                : language === 'ta'
                ? 'எழுதத் தெரியாவிட்டால் பேசிக் கேளுங்கள்'
                : language === 'tanglish'
                ? 'Type panna thevailla, pesiye kelunga'
                : 'Speak your question directly'}
            </p>
            <p className="text-[11px] text-emerald-200">
              {language === 'ta'
                ? 'பச்சை பட்டனை அழுத்தி கேள்வி கேளுங்கள்'
                : language === 'tanglish'
                ? 'Mic button azhuthi kelvi kelunga'
                : 'Tap the mic button and ask anything'}
            </p>
          </div>
        </div>

        {/* Big Mic Button */}
        <button
          type="button"
          onClick={handleToggleVoiceInput}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-white hover:bg-emerald-50 text-emerald-950'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 text-white" />
              <span>{language === 'ta' ? 'நிறுத்து' : 'Stop'}</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-emerald-800" />
              <span>{language === 'ta' ? 'பேசி கேட்க' : 'Tap & Speak'}</span>
            </>
          )}
        </button>
      </div>

      {/* Standard Text Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="shrink-0 flex items-center gap-2 bg-white rounded-2xl p-2 border border-emerald-200 shadow-xs"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={isListening ? t.listening : t.askPlaceholder}
          disabled={isLoading}
          className="flex-1 bg-transparent px-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <span>{t.send}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
