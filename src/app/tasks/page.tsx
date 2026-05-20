"use client";

import React, { useEffect, useState } from "react";
import { StudyAim, StudyTask, Subject, SubTask } from "@/types";
import { getAims, addAim, updateAim } from "@/services/aimService";
import { getTasks, addTask, updateTask } from "@/services/taskService";
import { getSubjects } from "@/services/subjectService";
import { addRevision } from "@/services/revisionService";

export default function TasksPage() {
  const [aims, setAims] = useState<StudyAim[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  const [newAimTitle, setNewAimTitle] = useState("");
  const [newAimDate, setNewAimDate] = useState("");
  
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Subtask inputs keyed by taskId
  const [subTaskInputs, setSubTaskInputs] = useState<Record<string, string>>({});

  const fetchData = async () => {
    try {
      const [aimsData, tasksData, subjectsData] = await Promise.all([
        getAims(), getTasks(), getSubjects()
      ]);
      setAims(aimsData);
      setTasks(tasksData);
      setSubjects(subjectsData);
      if (subjectsData.length > 0 && !selectedSubject) {
        setSelectedSubject(subjectsData[0].id);
      }
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
    if (!newTaskTitle || !selectedSubject) return;
    await addTask({
      title: newTaskTitle,
      dueDate: newTaskDate || new Date().toISOString().split('T')[0],
      isCompleted: false,
      subjectId: selectedSubject,
      subtasks: [],
    });
    setNewTaskTitle("");
    setNewTaskDate("");
    fetchData();
  };

  const handleToggleTask = async (task: StudyTask) => {
    await updateTask(task.id, { isCompleted: !task.isCompleted });
    fetchData();
  };

  const handleAddSubTask = async (taskId: string) => {
    const title = subTaskInputs[taskId];
    if (!title?.trim()) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newSubTask: SubTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      isCompleted: false
    };

    await updateTask(taskId, {
      subtasks: [...(task.subtasks || []), newSubTask]
    });
    
    setSubTaskInputs(prev => ({ ...prev, [taskId]: "" }));
    fetchData();
  };

  const handleToggleSubTask = async (taskId: string, subTaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newSubtasks = task.subtasks.map(st => 
      st.id === subTaskId ? { ...st, isCompleted: !st.isCompleted } : st
    );

    await updateTask(taskId, { subtasks: newSubtasks });
    fetchData();
  };

  const handleLogRevision = async (taskId: string) => {
    const conf = window.prompt("Enter confidence level for this revision: low, medium, or high", "medium");
    if (conf && ["low", "medium", "high"].includes(conf.toLowerCase())) {
      await addRevision({
        taskId,
        revisionDate: new Date().toISOString(),
        confidenceLevel: conf.toLowerCase() as "low"|"medium"|"high"
      });
      alert("Revision logged successfully for this task!");
    }
  };

  // Group tasks by subject
  const groupedTasks: Record<string, StudyTask[]> = {};
  tasks.forEach(t => {
    const key = t.subjectId || "Unassigned";
    if (!groupedTasks[key]) groupedTasks[key] = [];
    groupedTasks[key].push(t);
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px", fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "32px", fontFamily: "'Outfit', sans-serif" }}>
        Study Aims & Tasks
      </h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>
        
        {/* Aims Section */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#8b5cf6" }}>Broad Study Aims</h2>
          
          <form onSubmit={handleAddAim} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <input 
              type="text" 
              placeholder="Aim title (e.g., Finish all Rules by May)" 
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
            <button type="submit" className="btn-primary" style={{ padding: "0 16px" }}>Add Aim</button>
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
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#10b981" }}>Subject-Specific Tasks</h2>
          
          <form onSubmit={handleAddTask} style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="form-input"
              style={{ flex: "1 1 200px" }}
            >
              <option value="" disabled>Select Subject...</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Task (e.g. Learn all conduct rules)" 
              value={newTaskTitle} 
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="form-input"
              style={{ flex: "2 1 300px" }}
            />
            <input 
              type="date" 
              value={newTaskDate} 
              onChange={(e) => setNewTaskDate(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn-primary" style={{ padding: "0 16px", background: "#10b981", border: "none" }}>Add Task</button>
          </form>

          {Object.entries(groupedTasks).map(([subjectId, subjTasks]) => {
            const subjectName = subjects.find(s => s.id === subjectId)?.name || "Unassigned Subject";
            return (
              <div key={subjectId} style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px", marginBottom: "12px" }}>
                  {subjectName}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {subjTasks.map((task) => (
                    <div key={task.id} style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                        <input 
                          type="checkbox" 
                          checked={task.isCompleted} 
                          onChange={() => handleToggleTask(task)}
                          style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#10b981" }}
                        />
                        <div style={{ flex: 1, fontSize: "16px", fontWeight: "600", textDecoration: task.isCompleted ? "line-through" : "none", color: task.isCompleted ? "#64748b" : "#f1f5f9" }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>Due: {task.dueDate}</div>
                        <button 
                          onClick={() => handleLogRevision(task.id)}
                          className="btn-secondary"
                          style={{ padding: "4px 8px", fontSize: "11px" }}
                        >
                          Log Revision
                        </button>
                      </div>

                      {/* Sub-tasks */}
                      <div style={{ marginLeft: "32px", borderLeft: "2px solid rgba(255,255,255,0.1)", paddingLeft: "16px" }}>
                        {task.subtasks?.map(st => (
                          <div key={st.id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <input 
                              type="checkbox" 
                              checked={st.isCompleted} 
                              onChange={() => handleToggleSubTask(task.id, st.id)}
                              style={{ cursor: "pointer", accentColor: "#10b981" }}
                            />
                            <span style={{ fontSize: "14px", color: st.isCompleted ? "#64748b" : "#cbd5e1", textDecoration: st.isCompleted ? "line-through" : "none" }}>
                              {st.title}
                            </span>
                          </div>
                        ))}
                        
                        {/* Add Subtask Input */}
                        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                          <input 
                            type="text"
                            placeholder="Add a sub-task (e.g. Learn first 10 rules)"
                            className="form-input"
                            style={{ fontSize: "13px", padding: "6px 12px", flex: 1 }}
                            value={subTaskInputs[task.id] || ""}
                            onChange={(e) => setSubTaskInputs(p => ({ ...p, [task.id]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubTask(task.id); }}
                          />
                          <button onClick={() => handleAddSubTask(task.id)} className="btn-secondary" style={{ fontSize: "12px", padding: "4px 12px" }}>Add</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
