"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Subject } from "@/types";
import {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "@/services/subjectService";
import { IP_EXAM_SUBJECTS } from "@/data/ipSubjects";
import StatsBar from "@/components/StatsBar";
import SubjectCard from "@/components/SubjectCard";
import SubjectModal from "@/components/SubjectModal";
import FilterBar from "@/components/FilterBar";
import OverallProgress from "@/components/OverallProgress";

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaper, setSelectedPaper] = useState("all");

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load subjects. Check your Firebase configuration in .env.local.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSeed = async () => {
    if (
      !confirm(
        `This will add ${IP_EXAM_SUBJECTS.length} pre-defined IP exam subjects. Continue?`
      )
    )
      return;
    setSeeding(true);
    try {
      for (const sub of IP_EXAM_SUBJECTS) {
        await addSubject(sub);
      }
      await fetchSubjects();
    } catch (err) {
      console.error(err);
      setError("Failed to seed subjects.");
    } finally {
      setSeeding(false);
    }
  };

  const handleSave = async (
    data: Omit<Subject, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, data);
      } else {
        await addSubject(data);
      }
      await fetchSubjects();
      setModalOpen(false);
      setEditingSubject(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save. Check Firebase config.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subject?")) return;
    try {
      await deleteSubject(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setModalOpen(true);
  };

  // Filtered subjects
  const filteredSubjects = subjects.filter((s) => {
    const matchSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || s.category === selectedCategory;
    const matchStatus =
      selectedStatus === "all" || s.targetMet === selectedStatus;
    const matchPaper =
      selectedPaper === "all" || s.examPaper === selectedPaper;
    return matchSearch && matchCategory && matchStatus && matchPaper;
  });

  const categories = Array.from(new Set(subjects.map((s) => s.category)));

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "0 0 60px 0",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Hero Header */}
      <header
        style={{
          padding: "40px 32px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          marginBottom: "32px",
          background:
            "linear-gradient(180deg, rgba(99,102,241,0.06) 0%, transparent 100%)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: "20px",
                  padding: "4px 14px",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#a78bfa", fontWeight: "600", letterSpacing: "0.05em" }}>
                  INSPECTOR OF POSTS (DEPT OF POSTS)
                </span>
              </div>
              <h1
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: "900",
                  lineHeight: 1.1,
                  marginBottom: "8px",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <span className="gradient-text">Inspector of Posts</span>{" "}
                <span style={{ color: "#f1f5f9" }}>Study Tracker</span>
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  color: "#64748b",
                  maxWidth: "500px",
                  lineHeight: 1.6,
                }}
              >
                Track your preparation, set targets, and monitor progress across all Inspector of Posts subjects.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {subjects.length === 0 && !loading && (
                <button
                  onClick={handleSeed}
                  disabled={seeding}
                  className="btn-secondary"
                  style={{ fontSize: "13px" }}
                >
                  {seeding ? "Loading..." : "🌱 Load IP Subjects"}
                </button>
              )}
              <button
                onClick={() => {
                  setEditingSubject(null);
                  setModalOpen(true);
                }}
                className="btn-primary"
                style={{ fontSize: "14px", padding: "12px 24px" }}
              >
                + Add Subject
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 32px" }}>
        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "24px",
              fontSize: "14px",
            }}
          >
            ⚠️ {error}
            <div style={{ fontSize: "12px", color: "#f87171", marginTop: "6px", opacity: 0.7 }}>
              Make sure your <code style={{ background: "rgba(255,255,255,0.1)", padding: "1px 6px", borderRadius: "4px" }}>.env.local</code> file has valid Firebase credentials.
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="shimmer glass-card"
                style={{ height: "320px", borderRadius: "16px" }}
              />
            ))}
          </div>
        )}

        {!loading && (
          <>
            {/* Stats */}
            <StatsBar subjects={subjects} />

            {/* Overall Progress */}
            <OverallProgress subjects={subjects} />

            {/* Filters */}
            {subjects.length > 0 && (
              <FilterBar
                categories={categories}
                selectedCategory={selectedCategory}
                selectedStatus={selectedStatus}
                selectedPaper={selectedPaper}
                searchQuery={searchQuery}
                onCategoryChange={setSelectedCategory}
                onStatusChange={setSelectedStatus}
                onPaperChange={setSelectedPaper}
                onSearchChange={setSearchQuery}
              />
            )}

            {/* Results count */}
            {subjects.length > 0 && (
              <div
                style={{
                  marginBottom: "16px",
                  fontSize: "13px",
                  color: "#64748b",
                  fontWeight: "500",
                }}
              >
                Showing {filteredSubjects.length} of {subjects.length} subjects
              </div>
            )}

            {/* Empty state */}
            {subjects.length === 0 && (
              <div
                className="glass-card"
                style={{
                  textAlign: "center",
                  padding: "80px 40px",
                  border: "2px dashed rgba(99,102,241,0.2)",
                }}
              >
                <div style={{ fontSize: "64px", marginBottom: "24px" }}>📚</div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    marginBottom: "12px",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  <span className="gradient-text">Start Your Exam Journey</span>
                </h2>
                <p style={{ color: "#64748b", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px", lineHeight: 1.6 }}>
                  Load the pre-defined subjects based on the official Inspector of Posts syllabus, or add your own subjects manually.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="btn-primary"
                    style={{ padding: "14px 28px", fontSize: "15px" }}
                  >
                    {seeding ? "Loading Subjects..." : "🌱 Load All IP Subjects"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingSubject(null);
                      setModalOpen(true);
                    }}
                    className="btn-secondary"
                    style={{ padding: "14px 28px", fontSize: "15px" }}
                  >
                    + Add Custom Subject
                  </button>
                </div>
              </div>
            )}

            {/* No results after filter */}
            {subjects.length > 0 && filteredSubjects.length === 0 && (
              <div
                className="glass-card"
                style={{ textAlign: "center", padding: "40px" }}
              >
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
                <p style={{ color: "#64748b" }}>No subjects match your filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                    setSelectedPaper("all");
                  }}
                  className="btn-secondary"
                  style={{ marginTop: "12px", fontSize: "13px" }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Subject Grid */}
            {filteredSubjects.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "20px",
                }}
              >
                {filteredSubjects.map((subject, i) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    animationDelay={i * 0.04}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <SubjectModal
          subject={editingSubject}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingSubject(null);
          }}
        />
      )}
    </div>
  );
}
