import fs from "fs";
import csv from "csv-parser";

function loadSymptomsFromCSV(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const results: string[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row["Symptoms"]))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

// This function returns the list of symptoms
export async function riskKeywords(): Promise<string[]> {
  const symptoms = await loadSymptomsFromCSV("public/symptoms.csv");
  return symptoms;
}

