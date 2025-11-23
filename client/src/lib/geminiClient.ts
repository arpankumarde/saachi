// src/lib/geminiService.ts
// Local / hardcoded implementation — no external API calls.
// Keeps same function signatures so the rest of your app remains unchanged.

import { Message, Memory, Task } from "@/types";

/**
 * Simple local heuristics + canned reply generator.
 * This returns a hardcoded but friendly Saachi response — NO API calls.
 */
export const sendMessageToSaachi = async (
  history: Message[],
  currentMessage: string,
  ltm: Memory[]
): Promise<string> => {
  // small heuristic to tweak reply tone based on keywords
  const msg = (currentMessage || "").toLowerCase();

  // Prepare a gentle base reply
  const baseReplies = [
    "I'm here with you — tell me more about how you're feeling.",
    "Thanks for sharing. That sounds really important. Would you like a short breathing exercise now?",
    "I hear you. It's okay to feel that way — want to try a grounding exercise together?",
    "You're not alone. Can you tell me which part of this feels hardest right now?"
  ];

  // choose a canned reply based on keyword
  if (msg.includes("anx") || msg.includes("nerv") || msg.includes("panic")) {
    return "I'm sorry you're feeling anxious — let's try a simple 4-4-4 breathing exercise together. Breathe in 4, hold 4, breathe out 4. Want to try?";
  }

  if (msg.includes("sad") || msg.includes("depress") || msg.includes("down")) {
    return "I can hear how heavy this feels. Would it help to talk about what started this feeling, or would you like a small grounding prompt?";
  }

  if (msg.includes("sleep") || msg.includes("insomnia") || msg.includes("tired")) {
    return "Sleep is so important. Would you like a short sleep-friendly breathing routine or a gentle sleep tip?";
  }

  // if long-term memories available, personalize slightly
  const ltmNote = ltm && ltm.length > 0 ? ` I remember: ${ltm[ltm.length - 1].content}.` : "";

  // default canned response (select from baseReplies deterministically)
  const idx = Math.abs(currentMessage.length) % baseReplies.length;
  return baseReplies[idx] + ltmNote;
};

/**
 * Lightweight local task extraction.
 * Looks for obvious task-like patterns; otherwise returns [].
 */
export const extractTasksFromConversation = async (lastUserMessage: string, lastAiResponse: string): Promise<Task[]> => {
  const text = `${lastUserMessage} ${lastAiResponse}`.toLowerCase();

  const tasks: Task[] = [];

  // heuristics for common task phrases
  const taskPatterns: { regex: RegExp; title: string }[] = [
    { regex: /(meditat|meditation|breath)/i, title: "Try a 5-minute meditation" },
    { regex: /(drink|water|2l|2 liters)/i, title: "Drink 2L of water today" },
    { regex: /(journal|write.*gratitude|gratitude)/i, title: "Write a short gratitude journal" },
    { regex: /(walk|go for a walk|take a walk)/i, title: "Take a 20-minute walk" },
  ];

  for (const p of taskPatterns) {
    if (p.regex.test(text)) {
      tasks.push({
        id: crypto.randomUUID(),
        title: p.title,
        dueDate: undefined,
        status: "pending",
        origin: "chat"
      });
    }
  }

  return tasks;
};

/**
 * Local memorization heuristic: try to pull one short fact from recent conversation.
 * Returns null if nothing useful is found.
 */
export const memorizeFact = async (conversation: Message[]): Promise<string | null> => {
  if (!conversation || conversation.length < 2) return null;

  // merge last few messages
  const lastFew = conversation.slice(-4).map(m => m.content).join(" | ").toLowerCase();

  // small heuristics: preferences, routines, dislikes
  const patterns: { regex: RegExp; format: (m: RegExpMatchArray) => string }[] = [
    { regex: /(prefer|likes?) (morning|evening|night)/i, format: (m) => `Prefers ${m[2]} sessions` },
    { regex: /(enjoy|likes?) (nature|walks|yoga|meditation)/i, format: (m) => `Enjoys ${m[2]}` },
    { regex: /(allergic to|can't eat|avoids) (\w+)/i, format: (m) => `Avoids ${m[2]}` },
  ];

  for (const p of patterns) {
    const match = lastFew.match(p.regex);
    if (match) {
      return p.format(match as RegExpMatchArray);
    }
  }

  // fallback: if user stated a clear preference sentence
  const prefMatch = lastFew.match(/i (prefer|like|love) ([a-z\s]+)/i);
  if (prefMatch) {
    return `Prefers ${prefMatch[2].trim()}`;
  }

  return null;
};
