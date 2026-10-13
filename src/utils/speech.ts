/**
 * Enhanced Browser Speech Recognition and Speech Synthesis helper
 * Specially designed for farmers who cannot read or write.
 */

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

import { Language } from '../types';

let currentUtterances: SpeechSynthesisUtterance[] = [];
let isSpeakingActive = false;

// Gentle audio chimes using Web Audio API to alert farmers without needing to read
export function playNotificationTone(type: 'start' | 'success' | 'stop') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'start') {
      // Pleasant rising ding
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'success') {
      // Double warm chime
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else {
      // Soft low tone
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (e) {
    // Ignore audio context autoplay limitations
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as IWindow;
  return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
}

/**
 * Creates speech recognizer with auto Tamil / Indian English detection
 */
export function createSpeechRecognizer(
  language: Language,
  onResult: (transcript: string) => void,
  onError: (errorMsg: string) => void,
  onEnd: () => void
): { start: () => void; stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) return null;

  try {
    const win = window as unknown as IWindow;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    const recognizer = new SpeechRec();

    recognizer.continuous = false;
    recognizer.interimResults = false;
    // For both Tamil and Thanglish, ta-IN captures Tamil speech best
    recognizer.lang = language === 'en' ? 'en-IN' : 'ta-IN';

    recognizer.onresult = (event: any) => {
      const results = event.results;
      if (results && results.length > 0) {
        const transcript = results[0][0].transcript;
        if (transcript) {
          playNotificationTone('success');
          onResult(transcript);
        }
      }
    };

    recognizer.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      let message = 'Speech recognition error';
      if (event.error === 'not-allowed') {
        message =
          language === 'ta'
            ? 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. உலாவியில் மைக் அனுமதியை இயக்கவும்.'
            : language === 'tanglish'
            ? 'Microphone permission marukkappattadhu. Browser-la allow pannunga.'
            : 'Microphone permission was denied. Please allow microphone access.';
      } else if (event.error === 'no-speech') {
        message =
          language === 'ta'
            ? 'குரல் கேட்கவில்லை. மைக் பட்டனை அழுத்தி மீண்டும் பேசவும்.'
            : language === 'tanglish'
            ? 'Kural ketkkala. Mic button azhuthi marubadiyum pesunga.'
            : 'No speech was detected. Please tap mic and speak again.';
      }
      playNotificationTone('stop');
      onError(message);
    };

    recognizer.onend = () => {
      onEnd();
    };

    return {
      start: () => {
        try {
          playNotificationTone('start');
          recognizer.start();
        } catch (e) {
          console.warn('Recognizer already running or error starting:', e);
        }
      },
      stop: () => {
        try {
          recognizer.stop();
        } catch (e) {
          // ignore
        }
      },
    };
  } catch (err) {
    console.error('Error creating speech recognizer:', err);
    return null;
  }
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Enhanced Text-to-Speech (TTS) that splits text into natural sentences
 * to prevent browser utterance timeout issues and reads smoothly in Tamil/Indian voice.
 */
export function speakText(
  text: string,
  language: Language,
  onEnd?: () => void
): boolean {
  if (!isSpeechSynthesisSupported()) return false;

  try {
    stopSpeaking();

    // Clean text for speech
    const clean = text
      .replace(/[*#_`>•]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return false;

    // Split text into digestible sentence chunks (< 140 chars)
    const sentences = clean
      .split(/(?<=[.!?\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (sentences.length === 0) return false;

    isSpeakingActive = true;
    currentUtterances = [];

    const voices = window.speechSynthesis.getVoices();

    // Find best Tamil voice or Indian English voice
    let preferredVoice: SpeechSynthesisVoice | null = null;
    if (language === 'ta') {
      preferredVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith('ta')) ||
        voices.find((v) => v.lang.toLowerCase().includes('ta-in')) ||
        null;
    } else if (language === 'tanglish') {
      // For Thanglish (Tamil in Latin script), an Indian voice sounds most natural
      preferredVoice =
        voices.find((v) => v.lang.toLowerCase().includes('en-in')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('ta')) ||
        null;
    } else {
      preferredVoice = voices.find((v) => v.lang.toLowerCase().includes('en-in')) || null;
    }

    let currentIndex = 0;

    const speakNextChunk = () => {
      if (!isSpeakingActive || currentIndex >= sentences.length) {
        isSpeakingActive = false;
        currentUtterances = [];
        if (onEnd) onEnd();
        return;
      }

      const chunk = sentences[currentIndex];
      const utterance = new SpeechSynthesisUtterance(chunk);

      // Determine language code
      // If chunk has Tamil script characters, use ta-IN regardless
      const hasTamilScript = /[\u0B80-\u0BFF]/.test(chunk);
      if (hasTamilScript) {
        utterance.lang = 'ta-IN';
        if (!preferredVoice || !preferredVoice.lang.startsWith('ta')) {
          const taVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ta'));
          if (taVoice) utterance.voice = taVoice;
        }
      } else {
        utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      utterance.rate = 0.92; // Clear, comfortable listening speed for farmers
      utterance.pitch = 1.0;

      utterance.onend = () => {
        currentIndex++;
        speakNextChunk();
      };

      utterance.onerror = (e) => {
        console.warn('Speech chunk error:', e);
        currentIndex++;
        speakNextChunk();
      };

      currentUtterances.push(utterance);
      window.speechSynthesis.speak(utterance);
    };

    speakNextChunk();
    return true;
  } catch (err) {
    console.error('Speech synthesis failure:', err);
    isSpeakingActive = false;
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeaking(): void {
  isSpeakingActive = false;
  currentUtterances = [];
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }
}

export function isCurrentlySpeaking(): boolean {
  return isSpeakingActive;
}
