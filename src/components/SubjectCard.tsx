"use client";

import React from "react";
import { Subject } from "@/types";

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
  animationDelay?: number;
}

function ProgressRing({
  progress,
  color,
  size = 64,
}: {
  progress: number;
  color: string;
  size?: number;
}) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={6}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
          filter: `drop-shadow(0 0 6px ${color}88)`,
        }}
      />
    </svg>
  );
}

export default function SubjectCard({
  subject,
  onEdit,
  onDelete,
  animationDelay = 0,
}: SubjectCardProps) {
  const completedTopics = subject.topics.filter(
    (t) => t.status === "completed"
  ).length;
  const inProgressTopics = subject.topics.filter(
    (t) => t.status === "in_progress"
  ).length;

  const statusConfig = {
    met: {
      label: "Target Met ✓",
      className: "badge-met",
      icon: "🟢",
    },
    missed: {
      label: "Target Missed",
      className: "badge-missed",
      icon: "🔴",
    },
    pending: {
      label: "In Progress",
      className: "badge-pending",
      icon: "🟡",
    },
  };

  const priorityConfig = {
    high: { label: "High", className: "priority-high" },
    medium: { label: "Medium", className: "priority-medium" },
    low: { label: "Low", className: "priority-low" },
  };

  const status = statusConfig[subject.targetMet];
  const priority = priorityConfig[subject.priority];

  const isOverdue =
    subject.targetMet === "pending" &&
    subject.targetDate &&
    new Date(subject.targetDate) < new Date();

  return (
    <div
      className="glass-card fade-in-up"
      style={{
        padding: "24px",
        animationDelay: `${animationDelay}s`,
        borderLeft: `3px solid ${subject.color}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle color glow in background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "120px",
          height: "120px",
          background: `radial-gradient(circle, ${subject.color}15 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
          gap: "12px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "8px",
              flexWrap: "wrap",
            }}
          >
            <span
              className={priority.className}
              style={{
                fontSize: "11px",
                fontWeight: "600",
                padding: "2px 8px",
                borderRadius: "20px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {priority.label}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "500",
                padding: "2px 8px",
                borderRadius: "20px",
                background: `${subject.color}22`,
                color: subject.color,
                border: `1px solid ${subject.color}44`,
                letterSpacing: "0.03em",
              }}
            >
              {subject.examPaper}
            </span>
          </div>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#f1f5f9",
              lineHeight: 1.3,
              marginBottom: "4px",
            }}
          >
            {subject.name}
          </h3>
          <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
            {subject.category}
          </p>
        </div>

        {/* Progress Ring */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <ProgressRing
            progress={subject.progress}
            color={subject.color}
            size={64}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "700",
              color: subject.color,
            }}
          >
            {subject.progress}%
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div style={{ marginBottom: "16px" }}>
        <span
          className={status.className}
          style={{
            fontSize: "12px",
            fontWeight: "600",
            padding: "4px 12px",
            borderRadius: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {status.icon} {status.label}
          {isOverdue && subject.targetMet === "pending" && (
            <span
              style={{
                marginLeft: "4px",
                color: "#f87171",
                fontSize: "11px",
              }}
            >
              (Overdue!)
            </span>
          )}
        </span>
      </div>

      {/* Topics progress bar */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
            Topics: {completedTopics}/{subject.topics.length} done
            {inProgressTopics > 0 && (
              <span style={{ color: "#fbbf24", marginLeft: "6px" }}>
                ({inProgressTopics} in progress)
              </span>
            )}
          </span>
        </div>
        <div
          style={{
            height: "6px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${subject.progress}%`,
              background: `linear-gradient(90deg, ${subject.color}, ${subject.color}99)`,
              borderRadius: "3px",
              transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: `0 0 8px ${subject.color}66`,
            }}
          />
        </div>
      </div>

      {/* Dates */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "8px",
            padding: "8px 10px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "2px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Target Date
          </div>
          <div style={{ fontSize: "13px", color: subject.targetDate ? "#fbbf24" : "#475569", fontWeight: "600" }}>
            {subject.targetDate
              ? new Date(subject.targetDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Not set"}
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "8px",
            padding: "8px 10px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "2px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Achieved Date
          </div>
          <div style={{ fontSize: "13px", color: subject.achievedDate ? "#34d399" : "#475569", fontWeight: "600" }}>
            {subject.achievedDate
              ? new Date(subject.achievedDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </div>
        </div>
      </div>

      {/* Topics mini list (top 3) */}
      {subject.topics.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Key Topics
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {subject.topics.slice(0, 3).map((topic) => (
              <div
                key={topic.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: topic.status === "completed" ? "#34d399" : topic.status === "in_progress" ? "#fbbf24" : "#64748b",
                }}
              >
                <span style={{ fontSize: "10px" }}>
                  {topic.status === "completed" ? "✓" : topic.status === "in_progress" ? "◎" : "○"}
                </span>
                <span style={{ 
                  textDecoration: topic.status === "completed" ? "line-through" : "none",
                  opacity: topic.status === "completed" ? 0.7 : 1,
                }}>
                  {topic.name}
                </span>
              </div>
            ))}
            {subject.topics.length > 3 && (
              <div style={{ fontSize: "11px", color: "#475569" }}>
                +{subject.topics.length - 3} more topics
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => onEdit(subject)}
          className="btn-primary"
          style={{
            flex: 1,
            padding: "8px 16px",
            fontSize: "13px",
            background: `linear-gradient(135deg, ${subject.color}, ${subject.color}bb)`,
          }}
        >
          ✏️ Update
        </button>
        <button
          onClick={() => onDelete(subject.id)}
          className="btn-danger"
          style={{ padding: "8px 12px", fontSize: "13px" }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
