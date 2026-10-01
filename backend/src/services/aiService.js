import { GoogleGenAI } from "@google/genai";
import env from "../config/env.js";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey
});

const aiService = {
  async reply(message, history = []) {
    console.log("🔥 GEMINI HEALTH BUDDY CALLED");
    console.log("MESSAGE:", message);
    console.log("HISTORY:", history);

    const systemPrompt = `
You are AI Health Buddy inside the HEALTECH healthcare app.

Your job is to provide clear, helpful and personalized general health guidance based on what the user tells you.

IMPORTANT RULES:
- Pay attention to EVERY symptom and detail the user provides.
- Do not ignore symptoms simply because another symptom is more common.
- Use the conversation history to personalize your response.
- Do not claim to diagnose a disease with certainty.
- Explain possible causes or possibilities in general terms.
- Ask relevant follow-up questions when important information is missing.
- Suggest an appropriate medical specialization when relevant.
- If symptoms could be serious or urgent, clearly recommend prompt professional medical care.
- Do not prescribe medicines or tell the user to change prescription dosages.
- Do not ask for unnecessary sensitive personal information.
- Do not pretend to be a doctor.
- Keep responses clear and reasonably concise.
- If the user provides multiple symptoms, address the important symptoms individually.
- If the situation sounds like an emergency, prioritize immediate professional medical assistance.
`;

    const conversation = history
      .filter(
        item =>
          item &&
          (item.role === "user" || item.role === "assistant") &&
          (item.content || item.text)
      )
      .map(item => {
        const role = item.role === "assistant" ? "model" : "user";
        const text = item.content || item.text;

        return `${role}: ${text}`;
      })
      .join("\n");

    const prompt = `
${systemPrompt}

Conversation history:
${conversation || "No previous conversation."}

Current user message:
${message}

Respond directly to the user.
`;

    try {
      console.log("🔥 CALLING GEMINI");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      console.log("✅ GEMINI RESPONSE RECEIVED");

      return response.text;
    } catch (error) {
      console.error(
        "❌ GEMINI API ERROR:",
        error?.response?.data || error?.message || error
      );

      throw new Error("Failed to get response from Gemini");
    }
  }
};

export default aiService;