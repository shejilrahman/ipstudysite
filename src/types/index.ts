export interface Topic {
  id: string;
  name: string;
  status: "not_started" | "in_progress" | "completed";
  notes?: string;
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
  topicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Revision {
  id: string;
  topicId: string;
  subjectId: string;
  revisionDate: string;
  notes?: string;
  confidenceLevel: "low" | "medium" | "high";
  createdAt: string;
}

export type CategoryFilter = "all" | string;
export type StatusFilter = "all" | "pending" | "met" | "missed";
