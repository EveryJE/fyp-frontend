import { create } from 'zustand';

interface LocationState {
  location: { lng: number; lat: number } | null;
  setLocation: (location: { lng: number; lat: number }) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  setLocation: (location) => set({ location }),
}));