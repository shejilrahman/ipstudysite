"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Subject, Keyword } from "@/types";
import { getSubjects } from "@/services/subjectService";
import { getKeywordsForTopic, addKeyword, deleteKeyword } from "@/services/keywordService";

export default function TopicKeywordsPage() {
  const params = useParams();
  const router = useRouter();

  const subjectId = typeof params.subjectId === "string" ? params.subjectId : "";
  const topicId = typeof params.topicId === "string" ? params.topicId : "";

  const [subject, setSubject] = useState<Subject | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [word, setWord] = useState("");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);


  const topic = subject?.topics.find((t) => t.id === topicId);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const subjects = await getSubjects();
      const found = subjects.find((s) => s.id === subjectId);
      setSubject(found || null);
      const kws = await getKeywordsForTopic(topicId);
      setKeywords(kws);
    } finally {
      setLoading(false);
    }
  }, [subjectId, topicId]);

  useEffect(() => {
    if (subjectId && topicId) fetchData();
  }, [fetchData, subjectId, topicId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !reference.trim()) return;
    setSaving(true);
    await addKeyword({
      topicId,
      subjectId,
      word: word.trim(),
      reference: reference.trim(),
    });
    setWord("");
    setReference("");
    setSaving(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await deleteKeyword(id);
    fetchData();
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 32px", textAlign: "center", color: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
        Loading keywords...
      </div>
    );
  }

  if (!subject || !topic) {
    return (
      <div style={{ padding: "60px 32px", textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ color: "#f87171", fontSize: "18px" }}>Topic not found.</div>
        <button onClick={() => router.back()} className="btn-secondary" style={{ marginTop: "16px" }}>
          ← Go Back
        </button>
      </div>
    );
  }

  const statusColor = topic.status === "completed" ? "#10b981" : topic.status === "in_progress" ? "#f59e0b" : "#64748b";

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "16px",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ← Back to Syllabus
        </button>

        <div
          style={{
            background: `${subject.color}18`,
            border: `1px solid ${subject.color}44`,
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "8px",
          }}
        >
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
            {subject.examPaper} · {subject.name}
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#f1f5f9",
              fontFamily: "'Outfit', sans-serif",
              lineHeight: 1.3,
              marginBottom: "8px",
            }}
          >
            {topic.name}
          </h1>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "600",
              padding: "4px 10px",
              borderRadius: "20px",
              background: `${statusColor}22`,
              color: statusColor,
              border: `1px solid ${statusColor}44`,
              textTransform: "uppercase",
            }}
          >
            {topic.status.replace("_", " ")}
          </span>
        </div>

        <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6 }}>
          💡 Add key words from this topic. During revision, hover over a keyword to see which rule / section / article it refers to.
        </p>
      </div>

      {/* Add Keyword Form */}
      <div className="glass-card" style={{ padding: "24px", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#c4b5fd" }}>Add Keyword</h2>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "2 1 200px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Keyword / Key Phrase
            </label>
            <input
              className="ip-input"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g. deprived, suspension, misconduct"
              required
            />
          </div>
          <div style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Reference (hover note)
            </label>
            <input
              className="ip-input"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Rule 4, Section 12(a)"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
            style={{ padding: "12px 24px", alignSelf: "flex-end", flexShrink: 0 }}
          >
            {saving ? "Saving..." : "+ Add"}
          </button>
        </form>
      </div>

      {/* Keywords Cloud */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#f1f5f9" }}>
            Keywords ({keywords.length})
          </h2>
        </div>

        {keywords.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569", fontSize: "14px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔑</div>
            No keywords added yet. Add some keywords to start your revision system!
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {keywords.map((kw) => (
              <div
                key={kw.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {/* Keyword chip */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "24px",
                    background: `${subject.color}18`,
                    border: `1px solid ${subject.color}55`,
                    color: subject.color,
                    fontSize: "14px",
                    fontWeight: "700",
                    userSelect: "none",
                  }}
                >
                  {kw.word}
                  <button
                    onClick={() => handleDelete(kw.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#475569",
                      cursor: "pointer",
                      padding: "0 0 0 4px",
                      fontSize: "14px",
                      lineHeight: 1,
                    }}
                    title="Remove keyword"
                  >
                    ×
                  </button>
                </div>

                {/* Always-visible reference label */}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#64748b",
                    letterSpacing: "0.03em",
                  }}
                >
                  📌 {kw.reference}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revision Mode hint */}
      {keywords.length > 0 && (
        <div
          style={{
            marginTop: "24px",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "12px",
            padding: "16px 20px",
            fontSize: "13px",
            color: "#6ee7b7",
          }}
        >
          ✅ <strong>Revision tip:</strong> Read each keyword and try to reconstruct the full rule/section in your mind. The reference below each keyword (e.g. Rule 4) tells you exactly where to look if you need to refresh your memory.
        </div>
      )}
    </div>
  );
}
