import { analyzeRisk } from "./analyzer";
import { highRiskData, moderateRiskData, lowRiskData } from "./mockData";
import type { PatientData, AnalysisResult } from "@/types/patient";

// Filename → mock patient mapping (case-insensitive partial match)
const reportMap: Array<{ keys: string[]; data: PatientData }> = [
  {
    keys: ["high_risk", "sample_high", "high-risk"],
    data: highRiskData,
  },
  {
    keys: ["moderate_risk", "sample_moderate", "moderate-risk"],
    data: moderateRiskData,
  },
  {
    keys: ["low_risk", "sample_low", "low-risk"],
    data: lowRiskData,
  },
];

export async function parseFile(file: File): Promise<AnalysisResult> {
  const nameLower = file.name.toLowerCase();

  // ── JSON: parse directly ─────────────────────────────────────────────
  if (nameLower.endsWith(".json")) {
    const text = await file.text();
    const data = JSON.parse(text) as PatientData;
    return analyzeRisk(data);
  }

  // ── PDF: map filename → mock data ────────────────────────────────────
  if (nameLower.endsWith(".pdf")) {
    const matched = reportMap.find((entry) =>
      entry.keys.some((k) => nameLower.includes(k))
    );
    return analyzeRisk(matched ? matched.data : highRiskData);
  }

  // ── CSV: parse first data row ────────────────────────────────────────
  if (nameLower.endsWith(".csv")) {
    const text = await file.text();
    const lines = text.trim().split("\n").filter(Boolean);
    if (lines.length >= 2) {
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const values = lines[1].split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h] = values[i] ?? "";
      });
      return analyzeRisk(csvRowToPatient(row));
    }
  }

  // ── Fallback ──────────────────────────────────────────────────────────
  return analyzeRisk(highRiskData);
}

function csvRowToPatient(row: Record<string, string>): PatientData {
  return {
    age: num(row["age"], 28),
    gestational_age: num(row["gestational_age"], 32),
    sbp: num(row["sbp"], 120),
    dbp: num(row["dbp"], 80),
    blood_glucose: num(row["blood_glucose"], 95),
    bmi: num(row["bmi"], 22),
    hemoglobin: num(row["hemoglobin"], 12),
    urine_protein: row["urine_protein"] ?? "negative",
    fetal_heart_rate: num(row["fetal_heart_rate"], 140),
    fetal_position: row["fetal_position"] ?? "cephalic",
    parity: num(row["parity"], 0),
    previous_complications: row["previous_complications"]
      ? row["previous_complications"].split(";").filter(Boolean)
      : [],
    urinalysis: row["urinalysis"]
      ? row["urinalysis"].split(";").filter(Boolean)
      : [],
  };
}

function num(val: string | undefined, fallback: number): number {
  const n = parseFloat(val ?? "");
  return isNaN(n) ? fallback : n;
}
