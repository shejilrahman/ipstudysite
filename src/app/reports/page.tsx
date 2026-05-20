"use client";

import React, { useEffect, useState } from "react";
import { StudyAim, StudyTask, Revision, Subject } from "@/types";
import { getAims } from "@/services/aimService";
import { getTasks } from "@/services/taskService";
import { getRevisions } from "@/services/revisionService";
import { getSubjects } from "@/services/subjectService";

export default function ReportsPage() {
  const [aims, setAims] = useState<StudyAim[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [a, t, r, s] = await Promise.all([
          getAims(),
          getTasks(),
          getRevisions(),
          getSubjects(),
        ]);
        setAims(a);
        setTasks(t);
        setRevisions(r);
        setSubjects(s);
      } catch (error) {
        console.error("Error fetching reports data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: "40px", color: "#f8fafc", textAlign: "center" }}>Loading Reports...</div>;

  const completedAims = aims.filter((a) => a.isCompleted).length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  
  let totalTopics = 0;
  let completedTopics = 0;
  subjects.forEach(sub => {
    sub.topics.forEach(top => {
      totalTopics++;
      if (top.status === "completed") completedTopics++;
    });
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px", fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "32px", fontFamily: "'Outfit', sans-serif" }}>
        Study Reports & Analytics
      </h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        
        {/* Overall Completion */}
        <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px", fontWeight: "600" }}>Syllabus Topics Completed</div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "#38bdf8" }}>
            {completedTopics} <span style={{ fontSize: "20px", color: "#64748b" }}>/ {totalTopics}</span>
          </div>
          <div style={{ marginTop: "12px", background: "rgba(255,255,255,0.1)", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ background: "#38bdf8", height: "100%", width: totalTopics ? `${(completedTopics / totalTopics) * 100}%` : "0%" }} />
          </div>
        </div>

        {/* Aims Completion */}
        <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px", fontWeight: "600" }}>Aims Completed</div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "#8b5cf6" }}>
            {completedAims} <span style={{ fontSize: "20px", color: "#64748b" }}>/ {aims.length}</span>
          </div>
          <div style={{ marginTop: "12px", background: "rgba(255,255,255,0.1)", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ background: "#8b5cf6", height: "100%", width: aims.length ? `${(completedAims / aims.length) * 100}%` : "0%" }} />
          </div>
        </div>

        {/* Tasks Completion */}
        <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px", fontWeight: "600" }}>Tasks Completed</div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "#10b981" }}>
            {completedTasks} <span style={{ fontSize: "20px", color: "#64748b" }}>/ {tasks.length}</span>
          </div>
          <div style={{ marginTop: "12px", background: "rgba(255,255,255,0.1)", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ background: "#10b981", height: "100%", width: tasks.length ? `${(completedTasks / tasks.length) * 100}%` : "0%" }} />
          </div>
        </div>

      </div>

      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px", color: "#f1f5f9", fontFamily: "'Outfit', sans-serif" }}>Recent Revisions</h2>
      {revisions.length === 0 ? (
        <div style={{ color: "#64748b" }}>No revisions logged yet. Revise a topic and mark it from the syllabus page.</div>
      ) : (
        <div className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {revisions.slice(0, 10).map((rev) => {
            const subject = subjects.find(s => s.id === rev.subjectId);
            const topic = subject?.topics.find(t => t.id === rev.topicId);
            return (
              <div key={rev.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                <div>
                  <div style={{ fontWeight: "600", color: "#f8fafc" }}>{topic?.name || "Unknown Topic"}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{subject?.name || "Unknown Subject"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: "#cbd5e1" }}>{new Date(rev.revisionDate).toLocaleDateString()}</div>
                  <div style={{ 
                    fontSize: "11px", 
                    marginTop: "4px",
                    fontWeight: "600",
                    color: rev.confidenceLevel === "high" ? "#10b981" : rev.confidenceLevel === "medium" ? "#f59e0b" : "#ef4444" 
                  }}>
                    {rev.confidenceLevel.toUpperCase()} CONFIDENCE
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
