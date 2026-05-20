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

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px", fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "32px", fontFamily: "'Outfit', sans-serif" }}>
        Study Reports & Analytics
      </h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        
        {/* Aims Completion */}
        <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px", fontWeight: "600" }}>Broad Aims Completed</div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "#8b5cf6" }}>
            {completedAims} <span style={{ fontSize: "20px", color: "#64748b" }}>/ {aims.length}</span>
          </div>
          <div style={{ marginTop: "12px", background: "rgba(255,255,255,0.1)", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ background: "#8b5cf6", height: "100%", width: aims.length ? `${(completedAims / aims.length) * 100}%` : "0%" }} />
          </div>
        </div>

        {/* Tasks Completion */}
        <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px", fontWeight: "600" }}>Specific Tasks Completed</div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "#10b981" }}>
            {completedTasks} <span style={{ fontSize: "20px", color: "#64748b" }}>/ {tasks.length}</span>
          </div>
          <div style={{ marginTop: "12px", background: "rgba(255,255,255,0.1)", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ background: "#10b981", height: "100%", width: tasks.length ? `${(completedTasks / tasks.length) * 100}%` : "0%" }} />
          </div>
        </div>

        {/* Total Revisions */}
        <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
          <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px", fontWeight: "600" }}>Total Revisions Logged</div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "#38bdf8" }}>
            {revisions.length}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px", color: "#f1f5f9", fontFamily: "'Outfit', sans-serif" }}>Task & Revision Tracking</h2>
      
      {tasks.length === 0 ? (
        <div style={{ color: "#64748b" }}>No tasks added yet. Head to the Tasks page to start tracking!</div>
      ) : (
        <div className="glass-card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                <th style={{ padding: "16px", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>Subject</th>
                <th style={{ padding: "16px", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>Task</th>
                <th style={{ padding: "16px", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", textAlign: "center" }}>Studied / Completed</th>
                <th style={{ padding: "16px", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", textAlign: "center" }}>Revision Count</th>
                <th style={{ padding: "16px", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", textAlign: "right" }}>Last Revision</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const subject = subjects.find(s => s.id === task.subjectId);
                const taskRevisions = revisions.filter(r => r.taskId === task.id);
                const sortedRevs = [...taskRevisions].sort((a, b) => new Date(b.revisionDate).getTime() - new Date(a.revisionDate).getTime());
                const lastRev = sortedRevs[0];

                return (
                  <tr key={task.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "16px", color: "#cbd5e1", fontSize: "14px" }}>
                      {subject?.name || "Unassigned"}
                    </td>
                    <td style={{ padding: "16px", color: "#f8fafc", fontSize: "15px", fontWeight: "500" }}>
                      {task.title}
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      {task.isCompleted ? (
                        <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>✓ Yes</span>
                      ) : (
                        <span style={{ background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: "16px", textAlign: "center", color: "#38bdf8", fontWeight: "bold" }}>
                      {taskRevisions.length}
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      {lastRev ? (
                        <div>
                          <div style={{ fontSize: "13px", color: "#e2e8f0" }}>{new Date(lastRev.revisionDate).toLocaleDateString()}</div>
                          <div style={{ 
                            fontSize: "11px", 
                            marginTop: "2px",
                            fontWeight: "600",
                            color: lastRev.confidenceLevel === "high" ? "#10b981" : lastRev.confidenceLevel === "medium" ? "#f59e0b" : "#ef4444" 
                          }}>
                            {lastRev.confidenceLevel.toUpperCase()} CONFIDENCE
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#64748b", fontSize: "13px" }}>Never revised</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
