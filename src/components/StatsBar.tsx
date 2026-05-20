"use client";

import React from "react";
import { Subject } from "@/types";

interface StatsBarProps {
  subjects: Subject[];
}

export default function StatsBar({ subjects }: StatsBarProps) {
  const total = subjects.length;
  const met = subjects.filter((s) => s.targetMet === "met").length;
  const missed = subjects.filter((s) => s.targetMet === "missed").length;
  const pending = subjects.filter((s) => s.targetMet === "pending").length;
  const avgProgress =
    total > 0
      ? Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / total)
      : 0;
  const highPriority = subjects.filter((s) => s.priority === "high").length;
  const completedTopics = subjects.reduce(
    (acc, s) =>
      acc + s.topics.filter((t) => t.status === "completed").length,
    0
  );
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);

  const stats = [
    {
      label: "Total Subjects",
      value: total,
      icon: "📚",
      color: "#6366f1",
      bg: "rgba(99,102,241,0.1)",
    },
    {
      label: "Targets Met",
      value: met,
      icon: "✅",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
    },
    {
      label: "Missed",
      value: missed,
      icon: "❌",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.1)",
    },
    {
      label: "Pending",
      value: pending,
      icon: "⏳",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
    },
    {
      label: "Avg Progress",
      value: `${avgProgress}%`,
      icon: "📈",
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.1)",
    },
    {
      label: "Topics Done",
      value: `${completedTopics}/${totalTopics}`,
      icon: "🎯",
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "16px",
        marginBottom: "32px",
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="glass-card stat-card-accent fade-in-up"
          style={{
            padding: "20px",
            animationDelay: `${i * 0.05}s`,
            borderColor: `${stat.color}22`,
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: stat.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              marginBottom: "12px",
            }}
          >
            {stat.icon}
          </div>
          <div
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: stat.color,
              lineHeight: 1,
              marginBottom: "4px",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {stat.value}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
              fontWeight: "500",
              letterSpacing: "0.02em",
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
