"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const radarData = [
  { subject: "Blood Pressure", A: 72, fullMark: 100 },
  { subject: "Glucose", A: 58, fullMark: 100 },
  { subject: "BMI", A: 45, fullMark: 100 },
  { subject: "Hemoglobin", A: 30, fullMark: 100 },
  { subject: "Protein", A: 65, fullMark: 100 },
  { subject: "Age Factor", A: 40, fullMark: 100 },
];

const barData = [
  { name: "BP", value: 72, color: "#f59e0b" },
  { name: "Glucose", value: 58, color: "#f59e0b" },
  { name: "BMI", value: 45, color: "#10b981" },
  { name: "Hgb", value: 30, color: "#10b981" },
  { name: "Protein", value: 65, color: "#ef4444" },
  { name: "Age", value: 40, color: "#10b981" },
  { name: "Parity", value: 25, color: "#10b981" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 border border-white/10">
        <p className="text-slate-300 text-xs font-medium">{label}</p>
        <p className="text-cyan-400 text-sm font-bold">{payload[0]?.value} / 100</p>
      </div>
    );
  }
  return null;
};

export function RiskRadar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl p-6 border border-white/5"
    >
      <h3 className="text-white font-semibold mb-1">Risk Factor Radar</h3>
      <p className="text-slate-500 text-xs mb-6">Multi-dimensional risk visualization</p>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="rgba(255,255,255,0.07)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#64748b", fontSize: 11 }}
          />
          <Radar
            name="Risk"
            dataKey="A"
            stroke="#22d3ee"
            fill="#22d3ee"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function RiskBarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass rounded-xl p-6 border border-white/5"
    >
      <h3 className="text-white font-semibold mb-1">Risk Score by Marker</h3>
      <p className="text-slate-500 text-xs mb-6">Higher = greater contribution to overall risk</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={barData} barCategoryGap="30%">
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {barData.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
