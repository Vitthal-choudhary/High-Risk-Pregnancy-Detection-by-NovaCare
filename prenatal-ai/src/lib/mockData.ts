import type { PatientData } from "@/types/patient";

export const highRiskData: PatientData = {
  name: "Sample Patient A",
  age: 36,
  gestational_age: 34,
  sbp: 158,
  dbp: 102,
  blood_glucose: 165,
  bmi: 32.1,
  hemoglobin: 8.4,
  urine_protein: "3+",
  fetal_heart_rate: 148,
  fetal_position: "breech",
  parity: 1,
  previous_complications: ["gestational hypertension"],
  urinalysis: ["pre-eclampsia markers", "protein elevated"],
};

export const moderateRiskData: PatientData = {
  name: "Sample Patient B",
  age: 32,
  gestational_age: 28,
  sbp: 138,
  dbp: 88,
  blood_glucose: 135,
  bmi: 28.5,
  hemoglobin: 10.5,
  urine_protein: "1+",
  fetal_heart_rate: 145,
  fetal_position: "cephalic",
  parity: 0,
  previous_complications: [],
  urinalysis: [],
};

export const lowRiskData: PatientData = {
  name: "Sample Patient C",
  age: 27,
  gestational_age: 24,
  sbp: 112,
  dbp: 72,
  blood_glucose: 88,
  bmi: 21.8,
  hemoglobin: 12.5,
  urine_protein: "negative",
  fetal_heart_rate: 142,
  fetal_position: "cephalic",
  parity: 0,
  previous_complications: [],
  urinalysis: [],
};
