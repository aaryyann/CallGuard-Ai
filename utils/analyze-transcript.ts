import { riskKeywords } from "./flagged-keywords";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeTranscript(transcript: string) {
  const symptoms = await riskKeywords();

  const prompt = `You are a trusted and knowledgeable medical assistant. 
  Below is a transcript of a conversation between a patient and a nurse or medical professional.

  Please analyze the transcript from the ${symptoms.join(",")} and return this structured response as JSON:

  {
  "flaggedSymptoms": [list of symptoms],
  "possibleCondition": "give all possible conditions based on the symptoms and your knowledge",
  "advice": "give recommendations to the patient from your knowledge",
  "redFlags": "mention any urgent red flag symptoms",
  "confidenceScore": number (0-100),
  "riskLevel": "High" | "Medium" | "Low" | "None"
  }

  Respond ONLY with the JSON object.

  Transcript:
  ${transcript}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ text: prompt }]
  });

  const rawText = response.text;

  let parsed;
  try {
    const match = rawText?.match(/```json\s*([\s\S]*?)```/) || rawText?.match(/{[\s\S]*}/);
    if (match) {
      parsed = JSON.parse(match[1] || match[0]);
    }
  } catch (err) {
    console.error("Failed to parse AI response", err);
  }

  return {
    keywordsFlagged: parsed?.flaggedSymptoms ?? [],
    riskLevel: parsed?.riskLevel ?? "None",
    confidenceScore: parsed?.confidenceScore ?? 60,
    condition: parsed?.possibleCondition ?? "",
    advice: parsed?.advice ?? "",
    redFlags: parsed?.redFlags ?? ""
  };
}
