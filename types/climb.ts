export type ClimbType = 'boulder' | 'board';

export interface Climb {
  id: string;
  date: string; // ISO string
  type: ClimbType;
  photoUri: string | null;
  holdColor: string;
  grade: string;
  attempts: number;
  notes: string;
}
