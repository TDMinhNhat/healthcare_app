export interface Shift {
  id: number;
  shift: number;
  start: string; // format HH:MM
  end: string; // format HH:MM
  status: boolean;
}
