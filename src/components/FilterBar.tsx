"use client";

import React from "react";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  selectedStatus: string;
  selectedPaper: string;
  searchQuery: string;
  onCategoryChange: (cat: string) => void;
  onStatusChange: (status: string) => void;
  onPaperChange: (paper: string) => void;
  onSearchChange: (query: string) => void;
}

export default function FilterBar({
  categories,
  selectedCategory,
  selectedStatus,
  selectedPaper,
  searchQuery,
  onCategoryChange,
  onStatusChange,
  onPaperChange,
  onSearchChange,
}: FilterBarProps) {
  const filterBtnStyle = (active: boolean, color = "#6366f1") => ({
    padding: "6px 14px",
    borderRadius: "20px",
    border: active ? `1px solid ${color}` : "1px solid rgba(255,255,255,0.08)",
    background: active ? `${color}22` : "rgba(255,255,255,0.03)",
    color: active ? color : "#64748b",
    fontSize: "12px",
    fontWeight: "600" as const,
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap" as const,
  });

  return (
    <div
      className="glass-card"
      style={{ padding: "20px", marginBottom: "24px" }}
    >
      {/* Search */}
      <div style={{ marginBottom: "16px" }}>
        <input
          className="ip-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="🔍 Search subjects..."
          style={{ maxWidth: "400px" }}
        />
      </div>

      {/* Filters Row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
        {/* Status Filter */}
        <div>
          <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "6px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Status
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[
              { value: "all", label: "All" },
              { value: "pending", label: "⏳ Pending" },
              { value: "met", label: "✅ Met" },
              { value: "missed", label: "❌ Missed" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => onStatusChange(f.value)}
                style={filterBtnStyle(
                  selectedStatus === f.value,
                  f.value === "met" ? "#10b981" : f.value === "missed" ? "#ef4444" : f.value === "pending" ? "#f59e0b" : "#6366f1"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Paper Filter */}
        <div>
          <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "6px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Exam Paper
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["All Papers", "Preliminary", "Paper I", "Paper II", "Viva-Voce"].map((p) => (
              <button
                key={p}
                onClick={() => onPaperChange(p === "All Papers" ? "all" : p)}
                style={filterBtnStyle(
                  (p === "All Papers" ? "all" : p) === selectedPaper,
                  "#06b6d4"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "6px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Category
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button
              onClick={() => onCategoryChange("all")}
              style={filterBtnStyle(selectedCategory === "all", "#8b5cf6")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => onCategoryChange(c)}
                style={filterBtnStyle(selectedCategory === c, "#8b5cf6")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
