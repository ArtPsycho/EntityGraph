export interface Point {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'done';
  createdAt: string;
  toDoUntil: string;
  doneAt?: string;
  subBranches: SubBranch[];
}

export interface SubBranch {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'done';
  toDoUntil: string;
  createdAt: string;
  doneAt?: string;
}

export interface Branch {
  id: string;
  name: string;
  createdAt: string;
  points: Point[];
}

export interface Entity {
  id: string;
  name: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
  parameters?: Record<string, any>;
  branches: Branch[];
  notes: Note[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityListItem {
  id: string;
  fileName: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExportData {
  exportedAt: string;
  version: string;
  entities: EntityListItem[];
}