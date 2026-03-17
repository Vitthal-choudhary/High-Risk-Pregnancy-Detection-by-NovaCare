<div align="center">

# 🤰 NovaCare — High-Risk Pregnancy Detection

### AI-Powered Prenatal Risk Stratification for Clinical Decision Support

[![Next.js](https://img.shields.io/badge/Next.js-16.1.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![CatBoost](https://img.shields.io/badge/CatBoost-Referral%20Model-yellow?style=for-the-badge)](https://catboost.ai)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

> **Empowering clinicians with interpretable, real-time pregnancy risk assessment — because every second counts in maternal healthcare.**

</div>

---

## 📌 Overview

**NovaCare** is an end-to-end AI system that classifies pregnancy risk into three tiers — **High**, **Moderate**, and **Low** — using a trained **CatBoost gradient-boosted model** with full **SHAP explainability**. A modern **Next.js web application** lets clinicians upload patient data and get instant, interpretable risk reports.

```
Patient Data (JSON / CSV / PDF)
        │
        ▼
┌───────────────────┐    ┌──────────────────────────┐
│  CatBoost Model   │───▶│  Risk Score (0 – 100%)   │
│  (Gradient Boost) │    │  Sub-risks: PE, GDM, PTD │
└───────────────────┘    └──────────────────────────┘
        │
        ▼
  SHAP Explanations ──▶  Feature Contribution Breakdown
        │
        ▼
  Next.js Dashboard ──▶  Visual Report + PDF Export
```

---

## 🧠 The ML Model — CatBoost Referral Engine

### Why CatBoost?
CatBoost handles **categorical features natively** (e.g., fetal position, urine protein levels), is robust to **missing clinical data**, and produces well-calibrated probability estimates — critical for medical applications.

### Input Features

| Category | Features |
|---|---|
| **Demographics** | Age, Parity |
| **Obstetric** | Gestational Age (weeks), Fetal Position, Previous Complications |
| **Vital Signs** | Systolic BP, Diastolic BP, Fetal Heart Rate |
| **Labs** | Fasting Blood Glucose (mg/dL), Hemoglobin (g/dL), BMI |
| **Urinalysis** | Urine Protein (Negative / Trace / 1+ / 2+ / 3+ / 4+) |

### Risk Classification

| Risk Level | Probability Threshold | Action |
|---|---|---|
| 🔴 **High Risk** | > 65% | Immediate specialist referral |
| 🟡 **Moderate Risk** | 35% – 65% | Enhanced monitoring |
| 🟢 **Low Risk** | < 35% | Routine prenatal care |

### Sub-Risk Assessments
The model also predicts three specific comorbidity risks in parallel:

- **Pre-eclampsia (PE)** — driven by blood pressure, proteinuria, gestational age
- **Gestational Diabetes Mellitus (GDM)** — driven by fasting glucose and BMI
- **Preterm Delivery (PTD)** — correlated with overall risk level and gestational age

---

## 📊 Model Explainability — SHAP Analysis

NovaCare is fully explainable. Below are the SHAP visualizations produced by the CatBoost Referral Model:

### Feature Importance — Global Overview
![SHAP Features](Catboost-Model/SHAP%20Features.jpeg)
*Global feature importance: urine protein, blood pressure, and glucose are the dominant risk drivers.*

### SHAP Summary — CatBoost Referral Model
![SHAP Summary](Catboost-Model/SHAP%20Summary-CatBoost%20Referral%20Model.jpeg)
*Full SHAP beeswarm plot showing how each feature value (color = magnitude) pushes the prediction toward high or low risk.*

### High-Risk Case Breakdown
![SHAP High Risk](Catboost-Model/SHAP%20High%20Risk.jpeg)
*SHAP waterfall for a high-risk patient — proteinuria (4+) and hypertension dominate the positive contribution.*

### Low-Risk Case Breakdown
![SHAP Low Risk](Catboost-Model/SHAP%20low%20Risk.jpeg)
*SHAP waterfall for a low-risk patient — normal vitals and lab values push the score toward the safe zone.*

---

## 🗺️ Population-Level Insights — UMAP Projections

UMAP dimensionality reduction reveals the natural clustering structure in the patient population:

### 2D Patient Population Map
![UMAP Projection](Catboost-Model/UMAP%20Projection.jpeg)
*All patients projected onto 2D space — three distinct clusters emerge, matching the three risk categories.*

### High-Risk Density Map
![UMAP High-Risk Density](Catboost-Model/UMAP%20High-Risk%20Density%20Map.jpeg)
*Kernel density overlay highlighting where high-risk patients concentrate in feature space.*

---

## 💻 Frontend — NovaCare Web App

A polished, production-ready **Next.js** dashboard for clinicians.

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 (glass-morphism UI) |
| Charts | Recharts 3 |
| Animations | Framer Motion 12 |
| Icons | Lucide React |

### Application Flow

```
[Landing Page /]
      │  Click "Get Started"
      ▼
[Upload Page /upload]
      │  Drop JSON / CSV / PDF
      ▼
[Results Dashboard /results]
      ├── Risk Gauge (0–100%)
      ├── Metric Cards (BP, glucose, BMI, Hgb, protein…)
      ├── Sub-Risk Radar Chart (PE / GDM / PTD)
      ├── SHAP-style Feature Contribution Bar Chart
      └── Personalized Clinical Recommendations + PDF Export
```

### Screens at a Glance

| Page | What You See |
|---|---|
| **Landing** | Hero section, feature highlights, how-it-works walkthrough |
| **Upload** | Drag-and-drop zone, file format hints, sample data option |
| **Results** | Animated risk gauge, per-metric cards with status badges, radar chart for sub-risks, contribution chart, and action recommendations |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/High-Risk-Pregnancy-Detection-by-NovaCare.git
cd High-Risk-Pregnancy-Detection-by-NovaCare
```

### 2. Install Frontend Dependencies

```bash
cd prenatal-ai
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Try It With Sample Data

The app ships with three built-in patient profiles you can test immediately:

| Profile | Description |
|---|---|
| `sample_high_risk_report.pdf` | Pre-eclamptic patient with severe hypertension and 4+ proteinuria |
| `sample_moderate_risk_report.pdf` | Borderline glucose and mildly elevated BP |
| `sample_low_risk_report.pdf` | Healthy patient with normal vitals and labs |

Upload any of these from the **Upload** page, or drag-and-drop your own JSON/CSV patient file.

### Accepted Input Formats

**JSON** — structured `PatientData` object:
```json
{
  "age": 28,
  "gestationalAge": 32,
  "systolicBP": 145,
  "diastolicBP": 92,
  "bloodGlucose": 115,
  "hemoglobin": 10.5,
  "bmi": 29.1,
  "fetalHeartRate": 148,
  "urinProtein": "1+",
  "fetalPosition": "Cephalic",
  "parity": 1,
  "previousComplications": false
}
```

**CSV** — header row matching the fields above, one patient per row.

**PDF** — filename-based routing to the appropriate risk profile (for demo/testing).

---

## 📁 Repository Structure

```
High-Risk-Pregnancy-Detection-by-NovaCare/
│
├── Graphs/                              # SHAP & UMAP model visualizations
│   ├── SHAP Features.jpeg
│   ├── SHAP Summary-CatBoost Referral Model.jpeg
│   ├── SHAP High Risk.jpeg
│   ├── SHAP low Risk.jpeg
│   ├── UMAP Projection.jpeg
│   └── UMAP High-Risk Density Map.jpeg
│
├── prenatal-ai/                         # Next.js web application
│   ├── src/
│   │   ├── app/                         # Pages: landing, upload, results
│   │   ├── components/                  # UI components (charts, cards, gauge)
│   │   ├── lib/                         # analyzer.ts, parser.ts, mockData.ts
│   │   └── types/patient.ts             # TypeScript interfaces
│   └── package.json
│
├── sample_high_risk_report.pdf          # Test patient — high risk
├── sample_moderate_risk_report.pdf      # Test patient — moderate risk
├── sample_low_risk_report.pdf           # Test patient — low risk
├── main.pdf                             # Full research documentation
└── README.md
```

---

## 🔒 Privacy & Security

- **No persistent storage** — patient data is processed in-memory and never written to disk or sent to external servers.
- **Client-side analysis** — the risk scoring runs entirely in the browser.
- **No authentication required** for local/clinical deployment.

---

## 🏥 Clinical Disclaimer

> NovaCare is a **clinical decision support tool**, not a replacement for professional medical judgment. All risk assessments should be reviewed by a qualified healthcare provider. This system is intended to assist — not substitute — clinical expertise.

---

<div align="center">

Built with ❤️ by **NovaCare**

*Making high-risk pregnancy detection accessible, interpretable, and fast.*

</div>
