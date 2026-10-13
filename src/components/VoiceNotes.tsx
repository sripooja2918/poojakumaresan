import React, { useState, useEffect, useRef } from 'react';
import { Language, VoiceNoteRecord } from '../types';
import { translations } from '../utils/translations';
import {
  saveAudioRecord,
  getAllAudioRecords,
  deleteAudioRecord,
} from '../utils/audioStorage';
import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Tag,
  ShieldCheck,
  Headphones,
  Bot,
  Volume2,
  Sparkles,
} from 'lucide-react';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  speakText,
} from '../utils/speech';

interface VoiceNotesProps {
  language: Language;
  onAskAI?: (question: string) => void;
}

export const VoiceNotes: React.FC<VoiceNotesProps> = ({ language, onAskAI }) => {
  const t = translations[language];

  const [notes, setNotes] = useState<VoiceNoteRecord[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('general');
  const [spokenTranscript, setSpokenTranscript] = useState('');

  // Audio Playback State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Status & Error notifications
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [micBlocked, setMicBlocked] = useState(false);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const speechRecognizerRef = useRef<any>(null);

  // Load existing records on mount
  useEffect(() => {
    loadNotes();
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.stop();
      }
    };
  }, []);

  const loadNotes = async () => {
    const list = await getAllAudioRecords();
    setNotes(list);
  };

  const startRecording = async () => {
    setStatusMessage(null);
    setMicBlocked(false);
    setSpokenTranscript('');

    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setStatusMessage({
        type: 'error',
        text: 'MediaRecorder is not supported in this browser. Please use Chrome, Edge, or Firefox.',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine supported mime type
      const mimeTypes = ['audio/webm', 'audio/mp4', 'audio/ogg', ''];
      let chosenMime = '';
      for (const m of mimeTypes) {
        if (!m || MediaRecorder.isTypeSupported(m)) {
          chosenMime = m;
          break;
        }
      }

      const recorder = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        // Stop stream audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, {
          type: chosenMime || 'audio/webm',
        });

        if (audioBlob.size === 0) {
          setStatusMessage({
            type: 'error',
            text: t.saveFailed,
          });
          return;
        }

        // Save locally to IndexedDB
        setIsSaving(true);
        const finalTitle =
          spokenTranscript.trim() ||
          noteTitle.trim() ||
          `${language === 'ta' ? 'வயல் குரல் பதிவு' : language === 'tanglish' ? 'Vayal Voice Note' : 'Field Note'} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        const finalId = `voice-${Date.now()}`;

        const result = await saveAudioRecord(
          finalId,
          finalTitle,
          selectedCrop,
          audioBlob,
          recordDuration,
          spokenTranscript.trim()
        );

        setIsSaving(false);

        if (result.success && result.record) {
          setNotes((prev) => [result.record!, ...prev]);
          setStatusMessage({
            type: 'success',
            text: t.saveSuccess,
          });
          setNoteTitle('');
          setSpokenTranscript('');
          setRecordDuration(0);
        } else {
          // Do not claim saved unless confirmed!
          setStatusMessage({
            type: 'error',
            text: `${t.saveFailed}: ${result.error || 'Unknown error'}`,
          });
        }
      };

      // Also start speech recognition in parallel to transcribe Tamil spoken words
      if (isSpeechRecognitionSupported()) {
        try {
          const rec = createSpeechRecognizer(
            language === 'en' ? 'en' : 'ta',
            (text) => {
              setSpokenTranscript((prev) => (prev ? `${prev} ${text}` : text));
              setNoteTitle((prev) => (prev ? prev : text));
            },
            () => {},
            () => {}
          );
          if (rec) {
            speechRecognizerRef.current = rec;
            rec.start();
          }
        } catch (e) {
          // Speech recognition is optional addition
        }
      }

      recorder.start(250);
      setIsRecording(true);
      setRecordDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicBlocked(true);
      } else {
        setStatusMessage({
          type: 'error',
          text: `Microphone error: ${err?.message || 'Access denied'}`,
        });
      }
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayAudio = (record: VoiceNoteRecord) => {
    if (!record.audioBlobUrl) return;

    if (playingId === record.id) {
      currentAudioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }

    const audio = new Audio(record.audioBlobUrl);
    currentAudioRef.current = audio;
    setPlayingId(record.id);

    audio.onended = () => {
      setPlayingId(null);
    };

    audio.onerror = () => {
      setPlayingId(null);
      setStatusMessage({
        type: 'error',
        text: 'Failed to play recorded audio file.',
      });
    };

    audio.play().catch((e) => {
      console.warn('Playback error:', e);
      setPlayingId(null);
    });
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm(t.confirmDeleteNote)) {
      if (playingId === id && currentAudioRef.current) {
        currentAudioRef.current.pause();
        setPlayingId(null);
      }
      const ok = await deleteAudioRecord(id);
      if (ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    }
  };

  const handleSendToAI = (record: VoiceNoteRecord) => {
    if (onAskAI) {
      const q = record.noteDescription || record.title || 'Crop disease check';
      onAskAI(q);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Mic className="w-6 h-6 text-emerald-800" />
          <span>{t.voiceTitle}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t.voiceSubtitle}
        </p>
      </div>

      {/* Mic Blocked Helper */}
      {micBlocked && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>{t.micErrorTitle}</span>
          </div>
          <p className="text-xs text-amber-800">
            {t.micErrorHelp}
          </p>
        </div>
      )}

      {/* Recording Studio Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-4">
        {/* Title Input & Crop Tag */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {language === 'ta'
                ? 'குறிப்பு தலைப்பு (பேசினால் தானாக நிரம்பும்)'
                : language === 'tanglish'
                ? 'Note Title (pesinaal auto fill aagum)'
                : 'Note Title'}
            </label>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder={t.noteTitlePlaceholder}
              disabled={isRecording}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {t.selectCropTag}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              disabled={isRecording}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
            >
              <option value="general">{t.noCrop}</option>
              <option value="paddy">{t.paddy}</option>
              <option value="cotton">{t.cotton}</option>
              <option value="coconut">{t.coconut}</option>
              <option value="tomato">{t.tomato}</option>
              <option value="sugarcane">{t.sugarcane}</option>
            </select>
          </div>
        </div>

        {/* Live Audio Recording Big Button */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
          <div className="relative flex items-center justify-center">
            {isRecording && (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-red-400/30 animate-ping"></div>
                <div className="absolute w-24 h-24 rounded-full bg-red-500/20 animate-pulse"></div>
              </>
            )}

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isSaving}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-90 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-emerald-800 hover:bg-emerald-900'
              }`}
            >
              {isRecording ? (
                <Square className="w-8 h-8 fill-white" />
              ) : (
                <Mic className="w-9 h-9" />
              )}
            </button>
          </div>

          {/* Timer and Status */}
          <div className="text-center">
            <span
              className={`text-3xl font-mono font-bold tracking-wider ${
                isRecording ? 'text-red-600 animate-pulse' : 'text-slate-800'
              }`}
            >
              {formatSeconds(recordDuration)}
            </span>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
              {isRecording
                ? language === 'ta'
                  ? 'குரல் பதிவு செய்யப்படுகிறது... நிறுத்துவதற்கு சிவப்பு பட்டனை அழுத்தவும்'
                  : language === 'tanglish'
                  ? 'Kural record aagudhu... Nirutha red button azhuthunga'
                  : t.recordingInProgress
                : language === 'ta'
                ? 'தமிழில் பேச தொடங்குவதற்கு மைக் பட்டனை அழுத்தவும்'
                : language === 'tanglish'
                ? 'Pesuvadharku mic button-ai azhuthunga'
                : 'Tap big mic button to record voice memo'}
            </p>

            {spokenTranscript && (
              <p className="text-xs text-emerald-800 bg-white border border-emerald-200 rounded-xl px-3 py-1.5 mt-2 inline-block max-w-sm">
                🎙️ "{spokenTranscript}"
              </p>
            )}
          </div>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-red-50 text-red-900 border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{t.storageInfo}</span>
        </div>
      </div>

      {/* Stored Voice Notes List */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between">
          <span>
            {language === 'ta'
              ? 'சேமிக்கப்பட்ட வயல் பதிவுகள்'
              : language === 'tanglish'
              ? 'Saved Field Voice Notes'
              : 'Saved Field Recordings'} ({notes.length})
          </span>
        </h3>

        {notes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-emerald-100 text-center space-y-2">
            <Headphones className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {t.noNotesYet}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {notes.map((note) => {
              const isPlaying = playingId === note.id;
              return (
                <div
                  key={note.id}
                  className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {note.title}
                      </h4>
                      {note.cropTag && note.cropTag !== 'general' && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-md border border-emerald-200 uppercase">
                          {note.cropTag}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatSeconds(note.durationSeconds)}
                      </span>
                      <span>&bull;</span>
                      <span>{new Date(note.recordedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      {note.audioDataSize ? (
                        <>
                          <span>&bull;</span>
                          <span>{(note.audioDataSize / 1024).toFixed(0)} KB</span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* Audio & Ask AI Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                    {/* Ask AI button from voice note */}
                    {onAskAI && (
                      <button
                        onClick={() => handleSendToAI(note)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 transition-colors"
                        title="Ask AI Assistant about this voice note"
                      >
                        <Bot className="w-3.5 h-3.5 text-emerald-700" />
                        <span>
                          {language === 'ta'
                            ? 'AI-யிடம் கேட்க'
                            : language === 'tanglish'
                            ? 'AI-kitta Kekkalaam'
                            : 'Ask AI'}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => handlePlayAudio(note)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isPlaying
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-800 text-white hover:bg-emerald-900'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>{t.pauseAudio}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>{t.playAudio}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title={t.deleteNote}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
