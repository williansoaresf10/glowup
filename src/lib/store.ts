import { create } from 'zustand';
import { 
  FacialFeatures,
  OccasionRecommendations, 
  ScanStatus 
} from '../types';

interface AppState {
  // Scan state
  scanStatus: ScanStatus;
  setScanStatus: (status: ScanStatus) => void;
  
  // Facial features
  facialFeatures: FacialFeatures | null;
  setFacialFeatures: (features: FacialFeatures) => void;
  
  // Recommendations
  recommendations: OccasionRecommendations[] | null;
  setRecommendations: (recs: OccasionRecommendations[]) => void;
  
  // Selected occasion
  selectedOccasion: string | null;
  setSelectedOccasion: (occasion: string | null) => void;
  
  // Reset store
  resetStore: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  scanStatus: 'idle',
  facialFeatures: null,
  recommendations: null,
  selectedOccasion: null,
  
  // Actions
  setScanStatus: (status) => set({ scanStatus: status }),
  setFacialFeatures: (features) => set({ facialFeatures: features }),
  setRecommendations: (recs) => set({ recommendations: recs }),
  setSelectedOccasion: (occasion) => set({ selectedOccasion: occasion }),
  
  // Reset
  resetStore: () => set({
    scanStatus: 'idle',
    facialFeatures: null,
    recommendations: null,
    selectedOccasion: null,
  }),
}));