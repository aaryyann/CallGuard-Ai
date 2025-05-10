import { riskKeywords } from "./flagged-keywords";

export function analyzeTranscript(transcript: string) {
  const lowerTranscript = transcript.toLowerCase();
  const keywordsFlagged = riskKeywords.filter(keyword =>
    lowerTranscript.includes(keyword)
  );

  let riskLevel: "High" | "Medium" | "Low" | "None" = "None";

  if (keywordsFlagged.length >= 5) riskLevel = "High";
  else if (keywordsFlagged.length >= 3) riskLevel = "Medium";
  else if (keywordsFlagged.length >= 1) riskLevel = "Low";

  const confidenceScore = Math.min(95, 60 + keywordsFlagged.length * 5);

  return {
    keywordsFlagged,
    riskLevel,
    confidenceScore
  };
}
