import { create } from 'zustand';

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  isIndoor: boolean;
  coordinates: { lat: number; lng: number };
}

interface TripState {
  itinerary: Activity[];
  isRainMode: boolean;
  isHeavyTraffic: boolean;
  reasoningLog: string[];
  isUpdating: boolean;
  
  setItinerary: (plan: Activity[]) => void;
  toggleRain: () => void;
  toggleTraffic: () => void;
  addLog: (message: string) => void;
  setUpdating: (status: boolean) => void;
}

export const useTripStore = create<TripState>((set) => ({
  itinerary: [],
  isRainMode: false,
  isHeavyTraffic: false,
  reasoningLog: ["Engine initialized. Waiting for input..."],
  isUpdating: false,

  setItinerary: (plan) => set({ itinerary: plan }),
  toggleRain: () => set((state) => ({ isRainMode: !state.isRainMode })),
  toggleTraffic: () => set((state) => ({ isHeavyTraffic: !state.isHeavyTraffic })),
  addLog: (message) => set((state) => ({ reasoningLog: [message, ...state.reasoningLog] })),
  setUpdating: (status) => set({ isUpdating: status }),
}));
