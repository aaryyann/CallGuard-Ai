// Importing the `riskKeywords` function from the flagged-keywords module
import { riskKeywords } from "./flagged-keywords";

// Importing the GoogleGenAI class from the @google/genai package
import { GoogleGenAI } from "@google/genai";

// Initializing the GoogleGenAI instance with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Main function to analyze a transcript and extract structured medical insights
export async function analyzeTranscript(transcript: string) {
  // Fetching a list of risk-related keywords asynchronously
  const symptoms = await riskKeywords();

  // Constructing the prompt for the AI model with the transcript and risk keywords
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

  // Sending the prompt to the AI model and awaiting the response
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash", // Specifying the AI model to use
    contents: [{ text: prompt }] // Providing the prompt as input
  });

  // Extracting the raw text response from the AI model
  const rawText = response.text;

  let parsed; // Variable to store the parsed JSON response
  try {
    // Attempting to extract and parse the JSON object from the AI response
    const match = rawText?.match(/```json\s*([\s\S]*?)```/) || rawText?.match(/{[\s\S]*}/);
    if (match) {
      parsed = JSON.parse(match[1] || match[0]); // Parsing the matched JSON string
    }
  } catch (err) {
    // Logging an error if JSON parsing fails
    console.error("Failed to parse AI response", err);
  }

  // Returning the structured response with default values if parsing fails
  return {
    keywordsFlagged: parsed?.flaggedSymptoms ?? [], // List of flagged symptoms
    riskLevel: parsed?.riskLevel ?? "None", // Risk level (default: "None")
    confidenceScore: parsed?.confidenceScore ?? 60, // Confidence score (default: 60)
    condition: parsed?.possibleCondition ?? "", // Possible condition(s)
    advice: parsed?.advice ?? "", // Medical advice
    redFlags: parsed?.redFlags ?? "" // Urgent red flag symptoms
  };
}
