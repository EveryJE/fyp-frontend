import { create } from 'zustand';
import { TimetableData } from '~/types/timetable';

// Define types for departments and years
export const departments = [
  { id: "CE", name: "Computer Science & Engineering" },
  { id: "MN", name: "Mining Engineering" },
  { id: "MC", name: "Mechanical Engineering" },
  { id: "EL", name: "Electrical Engineering" },
  { id: "GM", name: "Geomatic Engineering" },
  { id: "SD", name: "Statistical Data Science" },
  { id: "CY", name: "Cybersecurity" },
  { id: "PE", name: "Petroleum Engineering" },
  { id: "RP", name: "Petroleum Refining and Petrochemical Engineering" },
  { id: "PG", name: "Petroleum Geosciences" },
  { id: "GL", name: "Geological Engineering" },
  { id: "MR", name: "Minerals Engineering" },
  { id: "RN", name: "Renewable Engineering" },
  { id: "NG", name: "Natural Gas Engineering" },
  { id: "IS", name: "Information Systems" },
  { id: "CH", name: "Chemical Engineering" },
  { id: "MA", name: "Mathematics" },
  { id: "ES", name: "Environmental & Safety Engineering" },
  { id: "LT", name: "Logistics & Transportation" },
  { id: "LA", name: "Land Administration" },
  { id: "SP", name: "Spatial Planning" },
  { id: "EC", name: "Economics and Industrial Organization" },
] as const;

export const years = [
  { id: 1, name: "100" },
  { id: 2, name: "200" },
  { id: 3, name: "300" },
  { id: 4, name: "400" },
] as const;

export type Department = typeof departments[number]["id"];
export type Year = typeof years[number]["id"];

// Define store state and actions
interface TimetableState {
  schedules: TimetableData | null;
  exams: TimetableData | null;
  selectedDepartment: Department | null;
  selectedYear: Year | null;
  classPattern: string;
  isLoading: boolean;
  error: string | null;
  setDepartment: (department: Department) => void;
  setYear: (year: Year) => void;
  fetchSchedules: (filename?: string) => Promise<void>;
  fetchExams: (filename?: string) => Promise<void>;
  clearError: () => void;
}

// Create Zustand store
export const useTimetableStore = create<TimetableState>((set, get) => ({
  schedules: null,
  exams: null,
  selectedDepartment: null,
  selectedYear: null,
  classPattern: '',
  isLoading: false,
  error: null,

  setDepartment: (department: Department) => {
    const { selectedYear } = get();
    const newClassPattern = selectedYear ? `${department} ${selectedYear}` : department;
    set({ selectedDepartment: department, classPattern: newClassPattern });
  },

  setYear: (year: Year) => {
    const { selectedDepartment } = get();
    const newClassPattern = selectedDepartment ? `${selectedDepartment} ${year}` : `${year}`;
    set({ selectedYear: year, classPattern: newClassPattern });
  },

  fetchSchedules: async (filename = 'Draft_1.xlsx') => {
    const { classPattern } = get();
    if (!classPattern) {
      set({ error: 'Please select both department and year' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const timestamp = new Date().getTime();
      const response = await fetch(
        `http://localhost:3000/api/v1/get_time_table?t=${timestamp}`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
          body: JSON.stringify({
            filename,
            class_pattern: classPattern,
            is_exam: false,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch schedules: ${response.statusText}`);
      }

      const data: TimetableData = await response.json();
      set({ schedules: data });
    } catch (err) {
      set({ error: (err as Error).message || 'Failed to load class schedules' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchExams: async (filename = 'Draft_1_ex.xlsx') => {
    const { classPattern } = get();
    if (!classPattern) {
      set({ error: 'Please select both department and year' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const timestamp = new Date().getTime();
      const response = await fetch(
        `http://localhost:3000/api/v1/get_time_table?t=${timestamp}`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
          body: JSON.stringify({
            filename,
            class_pattern: classPattern,
            is_exam: true,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch exams: ${response.statusText}`);
      }

      const data: TimetableData = await response.json();
      set({ exams: data });
    } catch (err) {
      set({ error: (err as Error).message || 'Failed to load exam timetable' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));