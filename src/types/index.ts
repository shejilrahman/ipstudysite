export interface Topic {
  id: string;
  name: string;
  status: "not_started" | "in_progress" | "completed";
  notes?: string;
}

export interface Keyword {
  id: string;
  topicId: string;
  subjectId: string;
  word: string;
  reference: string; // e.g. "Rule 4", "Section 12(a)"
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  category: string;
  targetDate: string;
  achievedDate?: string;
  targetMet: "pending" | "met" | "missed";
  progress: number; // 0-100
  topics: Topic[];
  priority: "high" | "medium" | "low";
  examPaper: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface StudyAim {
  id: string;
  title: string;
  targetDate: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudyTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: boolean;
  subjectId?: string;
  topicId?: string; // Kept for legacy compatibility if needed
  subtasks: SubTask[];
  createdAt: string;
  updatedAt: string;
}

export interface Revision {
  id: string;
  taskId: string;
  revisionDate: string;
  notes?: string;
  confidenceLevel: "low" | "medium" | "high";
  createdAt: string;
}

export type CategoryFilter = "all" | string;
export type StatusFilter = "all" | "pending" | "met" | "missed";
