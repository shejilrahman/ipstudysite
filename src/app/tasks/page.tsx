"use client";

import React, { useEffect, useState } from "react";
import { StudyAim, StudyTask } from "@/types";
import { getAims, addAim, updateAim } from "@/services/aimService";
import { getTasks, addTask, updateTask } from "@/services/taskService";

export default function TasksPage() {
  const [aims, setAims] = useState<StudyAim[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  
  const [newAimTitle, setNewAimTitle] = useState("");
  const [newAimDate, setNewAimDate] = useState("");
  
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  const fetchData = async () => {
    try {
      const aimsData = await getAims();
      setAims(aimsData);
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAimTitle) return;
    await addAim({
      title: newAimTitle,
      targetDate: newAimDate || new Date().toISOString().split('T')[0],
      isCompleted: false,
    });
    setNewAimTitle("");
    setNewAimDate("");
    fetchData();
  };

  const handleToggleAim = async (aim: StudyAim) => {
    await updateAim(aim.id, { isCompleted: !aim.isCompleted });
    fetchData();
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    await addTask({
      title: newTaskTitle,
      dueDate: newTaskDate || new Date().toISOString().split('T')[0],
      isCompleted: false,
    });
    setNewTaskTitle("");
    setNewTaskDate("");
    fetchData();
  };

  const handleToggleTask = async (task: StudyTask) => {
    await updateTask(task.id, { isCompleted: !task.isCompleted });
    fetchData();
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px", fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "32px", fontFamily: "'Outfit', sans-serif" }}>
        Study Aims & Tasks
      </h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        
        {/* Aims Section */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#8b5cf6" }}>Study Aims</h2>
          
          <form onSubmit={handleAddAim} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <input 
              type="text" 
              placeholder="Aim title (e.g., Finish PO Acts)" 
              value={newAimTitle} 
              onChange={(e) => setNewAimTitle(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <input 
              type="date" 
              value={newAimDate} 
              onChange={(e) => setNewAimDate(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn-primary" style={{ padding: "0 16px" }}>Add</button>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {aims.map((aim) => (
              <div key={aim.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <input 
                  type="checkbox" 
                  checked={aim.isCompleted} 
                  onChange={() => handleToggleAim(aim)}
                  style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#8b5cf6" }}
                />
                <div style={{ flex: 1, textDecoration: aim.isCompleted ? "line-through" : "none", color: aim.isCompleted ? "#64748b" : "#f1f5f9" }}>
                  {aim.title}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{aim.targetDate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#10b981" }}>Specific Tasks</h2>
          
          <form onSubmit={handleAddTask} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <input 
              type="text" 
              placeholder="Task title (e.g., Read Section 12)" 
              value={newTaskTitle} 
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <input 
              type="date" 
              value={newTaskDate} 
              onChange={(e) => setNewTaskDate(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn-primary" style={{ padding: "0 16px", background: "#10b981", border: "none" }}>Add</button>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tasks.map((task) => (
              <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <input 
                  type="checkbox" 
                  checked={task.isCompleted} 
                  onChange={() => handleToggleTask(task)}
                  style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#10b981" }}
                />
                <div style={{ flex: 1, textDecoration: task.isCompleted ? "line-through" : "none", color: task.isCompleted ? "#64748b" : "#f1f5f9" }}>
                  {task.title}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{task.dueDate}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
