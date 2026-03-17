import type { PatientData, AnalysisResult, ShapEntry, SubRisks } from "@/types/patient";

interface ScoredFactor {
  feature: string;
  points: number;
  maxPoints: number;
  reason?: string;
}

export function analyzeRisk(data: PatientData): AnalysisResult {
  const factors: ScoredFactor[] = [];

  // ── Blood Pressure ──────────────────────────────────────────────────
  let bpPoints = 0;
  let bpReason: string | undefined;
  if (data.sbp >= 160 || data.dbp >= 110) {
    bpPoints = 30;
    bpReason = "severe hypertension";
  } else if (data.sbp >= 140 || data.dbp >= 90) {
    bpPoints = 20;
    bpReason = "high blood pressure";
  } else if (data.sbp >= 130 || data.dbp >= 85) {
    bpPoints = 8;
    bpReason = "elevated blood pressure";
  }
  factors.push({ feature: "Blood Pressure", points: bpPoints, maxPoints: 30, reason: bpReason });

  // ── Blood Glucose ────────────────────────────────────────────────────
  let glucPoints = 0;
  let glucReason: string | undefined;
  if (data.blood_glucose >= 200) {
    glucPoints = 25;
    glucReason = "severe hyperglycemia";
  } else if (data.blood_glucose >= 140) {
    glucPoints = 15;
    glucReason = "gestational diabetes risk";
  } else if (data.blood_glucose >= 110) {
    glucPoints = 8;
    glucReason = "borderline glucose";
  }
  factors.push({ feature: "Glucose", points: glucPoints, maxPoints: 25, reason: glucReason });

  // ── BMI ──────────────────────────────────────────────────────────────
  let bmiPoints = 0;
  let bmiReason: string | undefined;
  if (data.bmi >= 35) {
    bmiPoints = 15;
    bmiReason = "severe obesity";
  } else if (data.bmi >= 30) {
    bmiPoints = 8;
    bmiReason = "obesity";
  } else if (data.bmi < 18.5) {
    bmiPoints = 5;
    bmiReason = "underweight";
  }
  factors.push({ feature: "BMI", points: bmiPoints, maxPoints: 15, reason: bmiReason });

  // ── Hemoglobin ───────────────────────────────────────────────────────
  let hbPoints = 0;
  let hbReason: string | undefined;
  if (data.hemoglobin < 7) {
    hbPoints = 25;
    hbReason = "severe anaemia";
  } else if (data.hemoglobin < 10) {
    hbPoints = 20;
    hbReason = "low haemoglobin";
  } else if (data.hemoglobin < 11) {
    hbPoints = 10;
    hbReason = "mild anaemia";
  }
  factors.push({ feature: "Hemoglobin", points: hbPoints, maxPoints: 25, reason: hbReason });

  // ── Urine Protein ────────────────────────────────────────────────────
  const proteinPointsMap: Record<string, number> = {
    negative: 0,
    trace: 0,
    "1+": 8,
    "2+": 18,
    "3+": 25,
    "4+": 30,
  };
  const proteinReasonMap: Record<string, string | undefined> = {
    negative: undefined,
    trace: undefined,
    "1+": "mild proteinuria",
    "2+": "significant proteinuria",
    "3+": "severe proteinuria",
    "4+": "severe proteinuria",
  };
  const pKey = (data.urine_protein ?? "negative").toLowerCase();
  const proteinPoints = proteinPointsMap[pKey] ?? 0;
  factors.push({
    feature: "Urine Protein",
    points: proteinPoints,
    maxPoints: 30,
    reason: proteinReasonMap[pKey],
  });

  // ── Fetal Position ───────────────────────────────────────────────────
  let posPoints = 0;
  let posReason: string | undefined;
  const position = (data.fetal_position ?? "cephalic").toLowerCase();
  if (position === "breech") {
    posPoints = 15;
    posReason = "breech presentation";
  } else if (position === "transverse" || position === "oblique") {
    posPoints = 18;
    posReason = "abnormal fetal position";
  }
  factors.push({ feature: "Fetal Position", points: posPoints, maxPoints: 18, reason: posReason });

  // ── Maternal Age ─────────────────────────────────────────────────────
  let agePoints = 0;
  let ageReason: string | undefined;
  if (data.age < 18) {
    agePoints = 10;
    ageReason = "teenage pregnancy";
  } else if (data.age > 35) {
    agePoints = 8;
    ageReason = "advanced maternal age";
  }
  factors.push({ feature: "Age", points: agePoints, maxPoints: 10, reason: ageReason });

  // ── Urinalysis (extra markers, not in SHAP chart) ────────────────────
  const urinalysis = data.urinalysis ?? [];
  let urinalysisPoints = 0;
  let urinalysisReason: string | undefined;
  if (urinalysis.some((u) => u.toLowerCase().includes("pre-eclampsia"))) {
    urinalysisPoints = 20;
    urinalysisReason = "pre-eclampsia detected";
  }

  // ── Previous complications ────────────────────────────────────────────
  let historyPoints = 0;
  let historyReason: string | undefined;
  if (data.previous_complications && data.previous_complications.length > 0) {
    historyPoints = 10;
    historyReason = "history of complications";
  }

  // ── Total score & probability ─────────────────────────────────────────
  const totalPoints =
    factors.reduce((s, f) => s + f.points, 0) + urinalysisPoints + historyPoints;
  const maxScore = 120;
  const rawProb = Math.min(totalPoints / maxScore, 1.0);
  const probability = Math.round(rawProb * 100) / 100;

  // ── Prediction label ──────────────────────────────────────────────────
  let prediction: "High Risk" | "Moderate Risk" | "Low Risk";
  if (probability > 0.65) prediction = "High Risk";
  else if (probability > 0.35) prediction = "Moderate Risk";
  else prediction = "Low Risk";

  // ── SHAP entries (severity % per feature) ────────────────────────────
  const shap: ShapEntry[] = factors
    .map((f) => ({
      feature: f.feature,
      value: f.maxPoints > 0 ? Math.round((f.points / f.maxPoints) * 100) : 0,
      contribution:
        totalPoints > 0 ? Math.round((f.points / totalPoints) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  // ── Sub-risks ────────────────────────────────────────────────────────
  let preEclampsia = 5;
  if (data.sbp >= 160 && (pKey === "3+" || pKey === "4+")) preEclampsia = 92;
  else if (
    data.sbp >= 140 &&
    (pKey === "2+" || pKey === "3+" || pKey === "4+")
  )
    preEclampsia = 75;
  else if (data.sbp >= 140) preEclampsia = 48;
  else if (pKey === "2+" || pKey === "3+" || pKey === "4+") preEclampsia = 45;
  else if (data.sbp >= 130 && pKey === "1+") preEclampsia = 28;
  if (urinalysisPoints > 0) preEclampsia = Math.min(preEclampsia + 15, 95);

  let gdm = 5;
  if (data.blood_glucose >= 200) gdm = 90;
  else if (data.blood_glucose >= 140) gdm = 65;
  else if (data.blood_glucose >= 110) gdm = 35;

  let preterm = 10;
  if (probability > 0.65 && data.gestational_age < 34) preterm = 60;
  else if (probability > 0.65) preterm = 40;
  else if (probability > 0.35) preterm = 28;

  const subRisks: SubRisks = { preEclampsia, gdm, preterm };

  // ── Reason string ─────────────────────────────────────────────────────
  const allFactors: ScoredFactor[] = [
    ...factors,
    ...(urinalysisReason
      ? [
          {
            feature: "Urinalysis",
            points: urinalysisPoints,
            maxPoints: 20,
            reason: urinalysisReason,
          },
        ]
      : []),
    ...(historyReason
      ? [
          {
            feature: "History",
            points: historyPoints,
            maxPoints: 10,
            reason: historyReason,
          },
        ]
      : []),
  ];
  const reasons = generateReasons(allFactors, prediction);

  return { prediction, probability, reasons, shap, subRisks, patientData: data };
}

function generateReasons(
  factors: ScoredFactor[],
  prediction: string
): string {
  const triggered = factors
    .filter((f) => f.points > 0 && f.reason)
    .sort((a, b) => b.points - a.points)
    .slice(0, 4)
    .map((f) => f.reason!);

  if (triggered.length === 0) {
    return "No significant risk factors detected. All clinical markers are within normal limits.";
  }

  const closing =
    prediction === "High Risk"
      ? "indicate high-risk pregnancy requiring immediate evaluation."
      : prediction === "Moderate Risk"
        ? "indicate moderate pregnancy risk requiring close monitoring."
        : "have been noted and should be monitored.";

  if (triggered.length === 1) {
    return `${capitalize(triggered[0])} ${closing}`;
  }
  if (triggered.length === 2) {
    return `${capitalize(triggered[0])} and ${triggered[1]} ${closing}`;
  }

  const last = triggered[triggered.length - 1];
  const rest = triggered.slice(0, -1);
  return `${rest.map((r, i) => (i === 0 ? capitalize(r) : r)).join(", ")}, and ${last} ${closing}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
