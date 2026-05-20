"use client";

import React, { useState, useEffect } from "react";
import { Subject, Topic } from "@/types";

interface SubjectModalProps {
  subject?: Subject | null;
  onSave: (data: Omit<Subject, "id" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}

const CATEGORY_OPTIONS = [
  "Core Legislation",
  "International IP",
  "Practical Skills",
  "Case Laws",
  "General Studies",
];

const COLOR_OPTIONS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f59e0b", "#10b981", "#06b6d4", "#84cc16",
  "#fb923c", "#a78bfa", "#34d399", "#60a5fa",
];

const defaultTopicState = (): Topic => ({
  id: crypto.randomUUID(),
  name: "",
  status: "not_started",
});

export default function SubjectModal({ subject, onSave, onClose }: SubjectModalProps) {
  const [form, setForm] = useState({
    name: "",
    category: "Core Legislation",
    examPaper: "Paper I",
    priority: "high" as Subject["priority"],
    targetDate: "",
    achievedDate: "",
    targetMet: "pending" as Subject["targetMet"],
    color: "#6366f1",
    notes: "",
  });

  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (subject) {
      setForm({
        name: subject.name,
        category: subject.category,
        examPaper: subject.examPaper,
        priority: subject.priority,
        targetDate: subject.targetDate || "",
        achievedDate: subject.achievedDate || "",
        targetMet: subject.targetMet,
        color: subject.color,
        notes: "",
      });
      setTopics(subject.topics || []);
    }
  }, [subject]);

  const computeProgress = (t: Topic[]) => {
    if (t.length === 0) return 0;
    const done = t.filter((tp) => tp.status === "completed").length;
    return Math.round((done / t.length) * 100);
  };

  const handleTopicStatus = (id: string, status: Topic["status"]) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const addTopic = () => {
    const trimmed = newTopicName.trim();
    if (!trimmed) return;
    setTopics((prev) => [...prev, { id: crypto.randomUUID(), name: trimmed, status: "not_started" }]);
    setNewTopicName("");
  };

  const removeTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const progress = computeProgress(topics);
    await onSave({
      ...form,
      topics,
      progress,
    });
    setSaving(false);
  };

  const topicStatusCycle = (current: Topic["status"]): Topic["status"] => {
    if (current === "not_started") return "in_progress";
    if (current === "in_progress") return "completed";
    return "not_started";
  };

  const topicStatusColor = (status: Topic["status"]) => {
    if (status === "completed") return "#10b981";
    if (status === "in_progress") return "#f59e0b";
    return "#475569";
  };

  const topicStatusIcon = (status: Topic["status"]) => {
    if (status === "completed") return "✓";
    if (status === "in_progress") return "◎";
    return "○";
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px",
          background: "rgba(15, 15, 40, 0.95)",
          border: "1px solid rgba(99,102,241,0.2)",
          boxShadow: "0 0 60px rgba(99,102,241,0.2), 0 40px 80px rgba(0,0,0,0.6)",
          animation: "fadeInUp 0.3s ease forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", fontFamily: "'Outfit', sans-serif" }}>
            <span className="gradient-text">
              {subject ? "✏️ Update Subject" : "➕ Add Subject"}
            </span>
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Subject name */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Subject Name *
            </label>
            <input
              className="ip-input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Patents Act, 1970"
            />
          </div>

          {/* Row: Category + Paper */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Category
              </label>
              <select
                className="ip-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Exam Paper
              </label>
              <select
                className="ip-input"
                value={form.examPaper}
                onChange={(e) => setForm({ ...form, examPaper: e.target.value })}
              >
                <option>Preliminary</option>
                <option>Paper I</option>
                <option>Paper II</option>
                <option>Viva-Voce</option>
              </select>
            </div>
          </div>

          {/* Row: Priority + Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Priority
              </label>
              <select
                className="ip-input"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Subject["priority"] })}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Target Status
              </label>
              <select
                className="ip-input"
                value={form.targetMet}
                onChange={(e) => setForm({ ...form, targetMet: e.target.value as Subject["targetMet"] })}
              >
                <option value="pending">⏳ Pending / In Progress</option>
                <option value="met">✅ Target Met (on time)</option>
                <option value="missed">❌ Missed (next day/late)</option>
              </select>
            </div>
          </div>

          {/* Row: Target Date + Achieved Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Target Date
              </label>
              <input
                type="date"
                className="ip-input"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Achieved Date
              </label>
              <input
                type="date"
                className="ip-input"
                value={form.achievedDate}
                onChange={(e) => setForm({ ...form, achievedDate: e.target.value })}
              />
            </div>
          </div>

          {/* Color picker */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Card Color
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: c,
                    border: form.color === c ? "3px solid white" : "2px solid transparent",
                    cursor: "pointer",
                    boxShadow: form.color === c ? `0 0 12px ${c}` : "none",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Topics Section */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Topics ({topics.length})
            </label>

            {/* Add topic input */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <input
                className="ip-input"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Add a topic..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTopic();
                  }
                }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={addTopic}
                className="btn-primary"
                style={{ padding: "10px 16px", whiteSpace: "nowrap", fontSize: "13px" }}
              >
                + Add
              </button>
            </div>

            {/* Topics list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "220px", overflowY: "auto" }}>
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleTopicStatus(topic.id, topicStatusCycle(topic.status))}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: topicStatusColor(topic.status),
                      padding: 0,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                    title="Click to cycle: not started → in progress → completed"
                  >
                    {topicStatusIcon(topic.status)}
                  </button>
                  <span
                    style={{
                      flex: 1,
                      fontSize: "13px",
                      color: topic.status === "completed" ? "#64748b" : "#e2e8f0",
                      textDecoration: topic.status === "completed" ? "line-through" : "none",
                    }}
                  >
                    {topic.name}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: topicStatusColor(topic.status),
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {topic.status.replace("_", " ")}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTopic(topic.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#475569",
                      fontSize: "14px",
                      padding: "2px 4px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {topics.length === 0 && (
                <div style={{ fontSize: "13px", color: "#475569", textAlign: "center", padding: "16px" }}>
                  No topics yet. Add one above!
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : subject ? "Update Subject" : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
