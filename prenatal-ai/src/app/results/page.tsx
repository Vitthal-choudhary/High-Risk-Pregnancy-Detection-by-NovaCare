"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { RiskGauge } from "@/components/results/RiskGauge";
import { MetricCard } from "@/components/results/MetricCard";
import { RiskRadar, RiskBarChart } from "@/components/results/RiskChart";
import { ReasonCard } from "@/components/results/ReasonCard";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  Activity,
  Droplets,
  Weight,
  Thermometer,
  TestTube,
  Heart,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  User,
} from "lucide-react";
import type { AnalysisResult } from "@/types/patient";
import { analyzeRisk } from "@/lib/analyzer";
import { highRiskData } from "@/lib/mockData";

// ── Fallback result (used when no sessionStorage data exists) ─────────
const fallbackResult: AnalysisResult = analyzeRisk(highRiskData);

// ── Helpers ───────────────────────────────────────────────────────────
type RiskLevel = "low" | "moderate" | "high";

function bpRiskLevel(sbp: number, dbp: number): RiskLevel {
  if (sbp >= 140 || dbp >= 90) return "high";
  if (sbp >= 130 || dbp >= 85) return "moderate";
  return "low";
}

function glucoseRiskLevel(v: number): RiskLevel {
  if (v >= 140) return "high";
  if (v >= 110) return "moderate";
  return "low";
}

function bmiRiskLevel(v: number): RiskLevel {
  if (v >= 35) return "high";
  if (v >= 30 || v < 18.5) return "moderate";
  return "low";
}

function hbRiskLevel(v: number): RiskLevel {
  if (v < 10) return "high";
  if (v < 11) return "moderate";
  return "low";
}

function proteinRiskLevel(p: string): RiskLevel {
  const map: Record<string, RiskLevel> = {
    "4+": "high",
    "3+": "high",
    "2+": "high",
    "1+": "moderate",
    trace: "low",
    negative: "low",
  };
  return map[p?.toLowerCase()] ?? "low";
}

function fhrRiskLevel(v: number): RiskLevel {
  if (v < 110 || v > 160) return "high";
  if (v < 120 || v > 155) return "moderate";
  return "low";
}

function buildRecommendations(result: AnalysisResult) {
  const { patientData: d, prediction, shap } = result;
  const recs: { type: "high" | "moderate" | "low"; icon: React.ElementType; text: string }[] = [];

  // Pre-eclampsia signal
  const pKey = (d.urine_protein ?? "negative").toLowerCase();
  const hasProtein = ["2+", "3+", "4+"].includes(pKey);
  if ((d.sbp >= 140 || d.dbp >= 90) && hasProtein) {
    recs.push({
      type: "high",
      icon: AlertTriangle,
      text: `Elevated blood pressure (${d.sbp}/${d.dbp} mmHg) combined with proteinuria (${d.urine_protein}) indicates possible pre-eclampsia. Immediate obstetric evaluation is recommended.`,
    });
  } else if (d.sbp >= 160 || d.dbp >= 110) {
    recs.push({
      type: "high",
      icon: AlertTriangle,
      text: `Severely elevated blood pressure (${d.sbp}/${d.dbp} mmHg) requires urgent clinical attention to prevent complications.`,
    });
  }

  // Anaemia
  if (d.hemoglobin < 10) {
    recs.push({
      type: d.hemoglobin < 7 ? "high" : "moderate",
      icon: d.hemoglobin < 7 ? AlertTriangle : Info,
      text: `Haemoglobin of ${d.hemoglobin} g/dL indicates ${d.hemoglobin < 7 ? "severe" : "moderate"} anaemia. Iron supplementation and haematology review are advised.`,
    });
  }

  // Glucose / GDM
  if (d.blood_glucose >= 140) {
    recs.push({
      type: "moderate",
      icon: Info,
      text: `Fasting glucose of ${d.blood_glucose} mg/dL is elevated. A 75g OGTT is recommended to screen for gestational diabetes mellitus.`,
    });
  } else if (d.blood_glucose >= 110) {
    recs.push({
      type: "moderate",
      icon: Info,
      text: `Borderline fasting glucose (${d.blood_glucose} mg/dL). Dietary counselling and repeat glucose monitoring are suggested.`,
    });
  }

  // Fetal position
  const pos = (d.fetal_position ?? "").toLowerCase();
  if (pos === "breech") {
    recs.push({
      type: "moderate",
      icon: Info,
      text: "Breech presentation detected. External cephalic version (ECV) or planned caesarean section should be discussed with the obstetric team.",
    });
  } else if (pos === "transverse" || pos === "oblique") {
    recs.push({
      type: "high",
      icon: AlertTriangle,
      text: `${pos.charAt(0).toUpperCase() + pos.slice(1)} fetal lie detected. This may require hospitalisation and planning for operative delivery.`,
    });
  }

  // All-clear note
  if (recs.length === 0) {
    if (prediction === "Low Risk") {
      recs.push({
        type: "low",
        icon: CheckCircle,
        text: "All clinical markers are within acceptable ranges. Continue standard antenatal monitoring schedule.",
      });
    } else {
      const topFactor = shap[0];
      recs.push({
        type: "moderate",
        icon: Info,
        text: `The primary concern is ${topFactor?.feature ?? "elevated risk markers"}. Please consult your healthcare provider for a detailed assessment.`,
      });
    }
  }

  // Final low-risk note if nothing normal was added
  const hasLow = recs.some((r) => r.type === "low");
  if (!hasLow && (d.hemoglobin >= 11 && d.fetal_heart_rate >= 110 && d.fetal_heart_rate <= 160)) {
    recs.push({
      type: "low",
      icon: CheckCircle,
      text: `Haemoglobin (${d.hemoglobin} g/dL) and fetal heart rate (${d.fetal_heart_rate} bpm) are within acceptable range. Continue standard monitoring.`,
    });
  }

  return recs;
}

const typeConfig = {
  high: "border-red-500/30 bg-red-500/5 text-red-300",
  moderate: "border-amber-500/30 bg-amber-500/5 text-amber-300",
  low: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
};

// ── Page ──────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult>(fallbackResult);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("prenatalAnalysis");
      if (raw) {
        setResult(JSON.parse(raw) as AnalysisResult);
      }
    } catch {
      // keep fallback
    }
  }, []);

  const { patientData: d, shap, subRisks, prediction, probability, reasons } = result;
  const score = Math.round(probability * 100);

  const metrics = [
    {
      label: "Blood Pressure",
      value: `${d.sbp}/${d.dbp}`,
      unit: "mmHg",
      normal: "< 120/80",
      risk: bpRiskLevel(d.sbp, d.dbp),
      icon: Activity,
      delay: 0,
    },
    {
      label: "Blood Glucose",
      value: d.blood_glucose,
      unit: "mg/dL",
      normal: "70–99",
      risk: glucoseRiskLevel(d.blood_glucose),
      icon: Droplets,
      delay: 0.06,
    },
    {
      label: "BMI",
      value: d.bmi,
      unit: "kg/m²",
      normal: "18.5–24.9",
      risk: bmiRiskLevel(d.bmi),
      icon: Weight,
      delay: 0.12,
    },
    {
      label: "Hemoglobin",
      value: d.hemoglobin,
      unit: "g/dL",
      normal: "> 11.0",
      risk: hbRiskLevel(d.hemoglobin),
      icon: Thermometer,
      delay: 0.18,
    },
    {
      label: "Urine Protein",
      value: d.urine_protein ?? "—",
      unit: "",
      normal: "Negative",
      risk: proteinRiskLevel(d.urine_protein),
      icon: TestTube,
      delay: 0.24,
    },
    {
      label: "Fetal Heart Rate",
      value: d.fetal_heart_rate,
      unit: "bpm",
      normal: "110–160",
      risk: fhrRiskLevel(d.fetal_heart_rate),
      icon: Heart,
      delay: 0.3,
    },
  ] as const;

  const recommendations = buildRecommendations(result);

  return (
    <main className="relative min-h-screen bg-[#050810] overflow-hidden">
      <Navbar />

      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(168,85,247,0.06) 0%, transparent 60%)",
        }}
      />
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10"
          >
            <div>
              <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-2">
                Analysis Complete
              </p>
              <h1 className="text-3xl font-bold text-white mb-2">
                Prenatal Risk <span className="gradient-text">Report</span>
              </h1>
              <p className="text-slate-500 text-sm flex items-center gap-2">
                {d.name && (
                  <>
                    <User size={13} className="text-slate-600" />
                    <span className="text-slate-400">{d.name}</span>
                    <span className="text-slate-700">·</span>
                  </>
                )}
                Generated on{" "}
                {new Date().toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <GlowButton variant="outline" size="sm">
                <Download size={16} />
                Export PDF
              </GlowButton>
              <GlowButton href="/upload" variant="cyan" size="sm">
                <RotateCcw size={16} />
                New Analysis
              </GlowButton>
            </div>
          </motion.div>

          {/* ── Reason for Referral (PROMINENT) ── */}
          <ReasonCard reasons={reasons} prediction={prediction} />

          {/* Overall Risk + Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-xl p-8 border border-red-500/20 flex flex-col items-center justify-center"
            >
              <p className="text-slate-400 text-sm mb-6 uppercase tracking-widest text-center">
                Overall Risk Score
              </p>
              <RiskGauge
                score={score}
                label={`Based on ${shap.length} clinical markers`}
              />
              <div className="mt-6 w-full space-y-2">
                {[
                  { label: "Pre-eclampsia Risk", pct: subRisks.preEclampsia },
                  { label: "GDM Risk", pct: subRisks.gdm },
                  { label: "Preterm Risk", pct: subRisks.preterm },
                ].map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-slate-400 font-mono">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            pct > 60
                              ? "linear-gradient(90deg, #ef4444, #f97316)"
                              : pct > 40
                                ? "linear-gradient(90deg, #f59e0b, #eab308)"
                                : "linear-gradient(90deg, #10b981, #22d3ee)",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Charts */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <RiskRadar shap={shap} />
              <RiskBarChart shap={shap} />
            </div>
          </div>

          {/* Clinical Markers */}
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-white font-semibold text-lg mb-4"
          >
            Clinical Markers
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {metrics.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>

          {/* Patient info strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-xl border border-white/5 p-5 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { label: "Age", value: `${d.age} yrs` },
              { label: "Gestational Age", value: `${d.gestational_age} wks` },
              { label: "Parity", value: d.parity },
              {
                label: "Fetal Position",
                value:
                  (d.fetal_position ?? "—").charAt(0).toUpperCase() +
                  (d.fetal_position ?? "").slice(1),
              },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-slate-600 text-xs mb-1">{label}</p>
                <p className="text-white font-semibold text-sm">{value}</p>
              </div>
            ))}
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-white font-semibold text-lg mb-4">
              AI Recommendations
            </h2>
            <div className="space-y-3">
              {recommendations.map(({ type, icon: Icon, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className={`rounded-xl border p-4 flex gap-3 ${typeConfig[type]}`}
                >
                  <Icon size={18} className="shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-slate-600 text-xs text-center mt-8"
          >
            This AI analysis is for informational purposes only and does not
            constitute medical advice. Always consult a qualified healthcare
            professional for diagnosis and treatment.
          </motion.p>
        </div>
      </div>
    </main>
  );
}
