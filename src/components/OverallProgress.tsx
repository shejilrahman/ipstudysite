"use client";

import React from "react";
import { Subject } from "@/types";

interface OverallProgressProps {
  subjects: Subject[];
}

export default function OverallProgress({ subjects }: OverallProgressProps) {
  if (subjects.length === 0) return null;

  const categoryGroups: Record<string, Subject[]> = {};
  subjects.forEach((s) => {
    if (!categoryGroups[s.category]) categoryGroups[s.category] = [];
    categoryGroups[s.category].push(s);
  });

  const categoryColors: Record<string, string> = {
    "Core Legislation": "#6366f1",
    "International IP": "#ec4899",
    "Practical Skills": "#10b981",
    "Case Laws": "#f43f5e",
    "General Studies": "#06b6d4",
  };

  const overall =
    subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length;

  return (
    <div className="glass-card" style={{ padding: "24px", marginBottom: "28px" }}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "700",
          marginBottom: "20px",
          color: "#f1f5f9",
        }}
      >
        📊 Category-wise Progress
      </h3>

      {/* Overall bar */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#f1f5f9" }}>
            Overall Progress
          </span>
          <span style={{ fontSize: "13px", fontWeight: "800", color: "#a78bfa" }}>
            {Math.round(overall)}%
          </span>
        </div>
        <div
          style={{
            height: "10px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${overall}%`,
              background: "linear-gradient(90deg, #6366f1, #a78bfa, #06b6d4)",
              borderRadius: "5px",
              boxShadow: "0 0 12px rgba(99,102,241,0.5)",
              transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>

      {/* Category bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {Object.entries(categoryGroups).map(([cat, subs]) => {
          const catProgress = Math.round(
            subs.reduce((acc, s) => acc + s.progress, 0) / subs.length
          );
          const color = categoryColors[cat] || "#6366f1";
          return (
            <div key={cat}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}
                >
                  {cat} ({subs.length})
                </span>
                <span
                  style={{ fontSize: "12px", fontWeight: "700", color }}
                >
                  {catProgress}%
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${catProgress}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                    borderRadius: "3px",
                    boxShadow: `0 0 8px ${color}44`,
                    transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
