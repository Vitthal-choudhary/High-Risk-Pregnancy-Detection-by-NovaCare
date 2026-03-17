export interface PatientData {
  name?: string;
  age: number;
  gestational_age: number; // weeks
  sbp: number; // systolic blood pressure mmHg
  dbp: number; // diastolic blood pressure mmHg
  blood_glucose: number; // mg/dL (fasting)
  bmi: number;
  hemoglobin: number; // g/dL
  urine_protein: string; // "negative" | "trace" | "1+" | "2+" | "3+" | "4+"
  fetal_heart_rate: number; // bpm
  fetal_position: string; // "cephalic" | "breech" | "transverse" | "oblique"
  parity: number;
  previous_complications?: string[];
  urinalysis?: string[];
}

export interface ShapEntry {
  feature: string;
  value: number; // 0–100: severity % for this feature (% of max possible score)
  contribution: number; // % of total risk score contributed by this feature
}

export interface SubRisks {
  preEclampsia: number; // 0–100
  gdm: number; // 0–100
  preterm: number; // 0–100
}

export type RiskLevel = "High Risk" | "Moderate Risk" | "Low Risk";

export interface AnalysisResult {
  prediction: RiskLevel;
  probability: number; // 0–1
  reasons: string;
  shap: ShapEntry[];
  subRisks: SubRisks;
  patientData: PatientData;
}
