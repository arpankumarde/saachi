// src/app/api/saachi/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import type { Message } from "@/types";

/**
 * Server-only route for Saachi AI (Gemini).
 * - POST { action: "reply" | "extract" | "memorize", payload: {...} }
 *
 * Ensure you set GOOGLE_API_KEY in .env.local (do NOT use NEXT_PUBLIC_ prefix).
 */

if (!process.env.GOOGLE_API_KEY) {
  console.warn("Warning: GOOGLE_API_KEY is not set. Routes will fail until it's provided.");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const SYSTEM_INSTRUCTION = `
You are Saachi, a compassionate, empathetic personal wellness assistant.
Your goal is to provide emotional support, listen actively, and help the user manage their well-being.
You use a warm, soothing tone. You are NOT a doctor or therapist.
If the user mentions self-harm, suicide, or a severe crisis, you MUST gently urge them to seek professional help immediately and provide standard helpline resources, then stop processing deeply.

You have access to "Long Term Memories" about the user. Use these to personalize your responses.
`;

/* ---------- Helpers (server side) ---------- */

async function generateReply(history: Message[], currentMessage: string, ltm: string[] = []): Promise<string> {
  const ltmContext = ltm.length ? `Here are some things I remember about you:\n${ltm.map(s => `- ${s}`).join("\n")}\n\n` : "";

  const recentHistory = history.slice(-10).map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + "\n" + ltmContext,
      temperature: 0.7
    },
    contents: [
      ...recentHistory,
      { role: "user", parts: [{ text: currentMessage }] }
    ]
  });

  // Try common response locations
  // Newer SDKs may put text in different fields; use fallback ordering.
  const text =
    // @ts-ignore - some SDK responses might have .text
    response.text ??
    // @ts-ignore
    response.output?.[0]?.content?.[0]?.text ??
    // fallback
    "I'm listening...";

  return (typeof text === "string") ? text : JSON.stringify(text);
}

async function extractTasks(lastUserMessage: string, lastAiResponse: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            dueDate: { type: Type.STRING }
          },
          required: ["title"]
        }
      }
    },
    contents: [
      {
        role: "user",
        parts: [{ text: `Analyze the following conversation snippet. Did the user imply a task, goal, or habit they want to track? Or did the assistant suggest a concrete step? If so, extract it as a task. If not, return an empty array.\n\nUser: ${lastUserMessage}\nAssistant: ${lastAiResponse}` }]
      }
    ]
  });

  const raw = (response as any).text ?? "[]";
  try {
    const tasks = JSON.parse(raw);
    return Array.isArray(tasks) ? tasks : [];
  } catch (err) {
    // If parsing fails, return empty list
    console.error("Failed to parse task extraction response:", err);
    return [];
  }
}

async function memorizeFact(conversation: Message[]): Promise<string | null> {
  if (!conversation || conversation.length < 4) return null;

  const transcript = conversation.slice(-4).map(m => `${m.role}: ${m.content}`).join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: `Read this transcript. Extract ONE significant fact about the user's life, preferences, or emotional state that would be useful to remember for the long term (LTM). If nothing significant is present, return "NOTHING".\n\n${transcript}` }]
      }
    ]
  });

  const text = ((response as any).text ?? "").toString().trim() || "NOTHING";
  if (text === "NOTHING") return null;
  return text;
}

/* ---------- Route Handler ---------- */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body?.action;
    const payload = body?.payload ?? {};

    if (action === "reply") {
      const history: Message[] = payload.history ?? [];
      const message: string = payload.message ?? "";
      const ltm: string[] = payload.ltm ?? [];
      const reply = await generateReply(history, message, ltm);
      return NextResponse.json({ reply });
    }

    if (action === "extract") {
      const lastUserMessage: string = payload.lastUserMessage ?? "";
      const lastAiResponse: string = payload.lastAiResponse ?? "";
      const tasks = await extractTasks(lastUserMessage, lastAiResponse);
      return NextResponse.json({ tasks });
    }

    if (action === "memorize") {
      const conversation: Message[] = payload.conversation ?? [];
      const fact = await memorizeFact(conversation);
      return NextResponse.json({ fact });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("API /api/saachi error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
