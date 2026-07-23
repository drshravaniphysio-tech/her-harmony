import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Assistant Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, systemInstruction } = req.body;
    
    // Using chat interface if history is provided, otherwise simple generateContent
    if (history && history.length > 0) {
      const chat = ai.chats.create({
        model: 'gemini-3.6-flash',
        config: {
          systemInstruction: systemInstruction || "You are HerHarmony AI, a caring, non-judgmental, and supportive personal wellness companion for women. You help with emotional, mental, physical, and relationship well-being. Talk like a caring friend. Suggest professional help if you detect serious mental or physical health concerns. Do not diagnose medical conditions.",
        },
        history: history,
      });
      const result = await chat.sendMessage({ message });
      res.json({ text: result.text });
    } else {
      const result = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: message,
        config: {
          systemInstruction: systemInstruction || "You are HerHarmony AI, a caring, non-judgmental, and supportive personal wellness companion for women. You help with emotional, mental, physical, and relationship well-being. Talk like a caring friend. Suggest professional help if you detect serious mental or physical health concerns. Do not diagnose medical conditions.",
        }
      });
      res.json({ text: result.text });
    }
  } catch (error: any) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Recovery Plan Generator
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { issue, budget, preferences } = req.body;
    const prompt = `Generate a personalized healing recovery plan for a woman dealing with: ${issue}. 
    Budget: ${budget}. 
    Preferences: ${preferences}.
    Include: Morning routine, Evening routine, Meditation, Exercise, Journaling, Nutrition, Sleep schedule, Reading suggestions, Music suggestions, Nature activities.
    Format the response as a structured JSON object.`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    res.json(JSON.parse(result.text || '{}'));
  } catch (error: any) {
    console.error('Plan Generation Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Nutrition AI Endpoint
app.post('/api/nutrition', async (req, res) => {
  try {
    const { query, userData } = req.body;
    const prompt = `Act as a Women's Nutrition AI. User Query: ${query}. 
    User Context: ${JSON.stringify(userData)}.
    Generate a personalized nutrition plan or advice including healthy recipes, grocery lists, and balanced guidance.
    Focus on women-specific health needs like PCOS, pregnancy, menopause, iron deficiency, etc. if applicable.`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });
    res.json({ text: result.text });
  } catch (error: any) {
    console.error('Nutrition AI Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Healing Places Endpoint
app.post('/api/healing-places', async (req, res) => {
  try {
    const { preferences, budget, location } = req.body;
    const prompt = `Recommend 3 peaceful healing places for a woman based on:
    Preferences: ${preferences}
    Budget: ${budget}
    Current Location: ${location}
    Include for each: Estimated travel cost, Best season to visit, Nearby attractions, Safety information, Travel duration.`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });
    res.json({ text: result.text });
  } catch (error: any) {
    console.error('Healing Places Error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
