import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google Gemini API securely on server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'AgriSaarthi AI',
    geminiConfigured: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// AI Farming Assistant endpoint
app.post('/api/gemini/chat', async (req, res) => {
  const { prompt, language = 'en', history = [] } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      error: 'BAD_REQUEST',
      message: 'A valid question or prompt is required.',
    });
  }

  // If Gemini is not configured or offline, return fallbackNeeded flag with friendly reason
  if (!ai || !apiKey) {
    return res.status(200).json({
      success: false,
      fallbackNeeded: true,
      reason: 'KEY_NOT_CONFIGURED',
      message:
        language === 'ta'
          ? 'Gemini API விசை கிடைக்கவில்லை அல்லது ஆஃப்லைன் பயன்முறையில் உள்ளது. முன்பே ஏற்றப்பட்ட மாதிரி பதில் காட்டப்படுகிறது.'
          : 'Gemini API key is not configured or server is in offline mode. Displaying preloaded expert response.',
    });
  }

  try {
    let langInstruction = 'Respond in clear, practical, bulleted English suitable for farmers and agricultural students.';
    if (language === 'ta') {
      langInstruction = 'Respond primarily in clear, natural Tamil (தமிழ்). You can keep technical biological names or fertilizer chemical grades (like NPK 17:17:17) in English/Tamil for clarity.';
    } else if (language === 'tanglish' || /enna|pannradhu|vadiruchu|chedi|thakkali|puchi|poochi|uram|thanni|thanneer|vayal|marundhu|tholla|irukku|kuruthu|kurumbai/i.test(prompt)) {
      langInstruction = `CRITICAL LANGUAGE REQUIREMENT: The user wants THANGLISH (Tamil words written in English / Latin script, e.g., "Thakkali chedi vadiruchu na...", "Nel la kuruthupuchi poga...", "Thennai kurumbai udhirudhu...").
Respond ENTIRELY in friendly, spoken, conversational THANGLISH (Tamil words spelled in English letters).
Do NOT reply in pure English or pure Tamil script unless quoting an official chemical label. Use natural conversational phrases like:
- "Thakkali chedi vadiruchu na idhukku 2 mukkiya kaaranangal irukkalaam..."
- "Udanadi action edukkanum..."
- "1 acre-ku ivvalavu alavu podunga..."
Always format cleanly with bullet points and bold headers.`;
    }

    const systemInstruction = `You are AgriSaarthi AI, an expert, encouraging, and farmer-centric agriculture advisory assistant developed for an agricultural hackathon in India.
Provide practical, actionable guidance on farming, covering:
- Major crops: Paddy (Rice / Nel), Cotton (Paruthi), Coconut (Thennai), Tomato (Thakkali), Sugarcane (Karumbu), and other field crops.
- Crop management: Seed selection, nursery preparation, spacing, organic manures, NPK fertilizers, micronutrients, drip/furrow irrigation, and weed control.
- Integrated Pest & Disease Management (IPM): Early symptoms, biological/organic solutions (Neem oil, Trichoderma, pheromone traps), and recommended interventions.
- Climate & soil tips: Drought tolerance, monsoon waterlogging, soil pH, and composting.
${langInstruction}
Guidelines:
1. Be concise, direct, and structured with clear step-by-step points.
2. Avoid generic filler. Give real farming advice with numbers where helpful (e.g. days after sowing, water intervals, dosage per acre).
3. MANDATORY SAFETY CLAUSE: Conclude with a brief reminder that farmers must verify exact chemical dosages and pesticide concentrations with their local Agricultural Officer, Village Extension Worker, or Krishi Vigyan Kendra (KVK).`;

    // Format conversation history
    const formattedContents = [];
    if (Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-6);
      for (const item of recent) {
        if (item.text && (item.role === 'user' || item.role === 'model')) {
          formattedContents.push({
            role: item.role,
            parts: [{ text: String(item.text) }],
          });
        }
      }
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: prompt.trim() }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.65,
      },
    });

    const reply = response.text || '';

    return res.json({
      success: true,
      reply,
      source: 'gemini-live',
    });
  } catch (error: any) {
    console.error('Gemini API execution error:', error);
    return res.status(200).json({
      success: false,
      fallbackNeeded: true,
      reason: 'API_ERROR',
      errorMessage: error?.message || 'Server error invoking Gemini API',
      message:
        language === 'ta'
          ? 'Gemini API சேவையில் தற்காலிக பிழை ஏற்பட்டுள்ளது. முன்பே சரிபார்க்கப்பட்ட விவசாய பதில் வழங்கப்படுகிறது.'
          : 'Encountered a temporary issue connecting to Gemini. Serving preloaded expert agricultural response.',
    });
  }
});

// Start Express server and connect Vite in development
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[AgriSaarthi AI] Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
