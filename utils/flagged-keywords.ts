import symptoms from "../public/symptoms.json";

export async function riskKeywords(): Promise<string[]> {
  return symptoms;
}
