import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VisitedMonument {
  id: string;
  visitCount: number;
  lastVisited: string; // ISO date string
}

interface MonumentStore {
  visitedMonuments: VisitedMonument[];
  
  // Actions
  incrementVisitCount: (monumentId: string) => void;
  getVisitCount: (monumentId: string) => number;
  clearHistory: () => void;
}

export const useMonumentStore = create<MonumentStore>()(
  persist(
    (set, get) => ({
      visitedMonuments: [],
      
      incrementVisitCount: (monumentId: string) => {
        set((state) => {
          const existingMonument = state.visitedMonuments.find(
            (m) => m.id === monumentId
          );
          
          if (existingMonument) {
            // Update existing monument
            return {
              visitedMonuments: state.visitedMonuments.map((m) =>
                m.id === monumentId
                  ? {
                      ...m,
                      visitCount: m.visitCount + 1,
                      lastVisited: new Date().toISOString(),
                    }
                  : m
              ),
            };
          } else {
            // Add new monument
            return {
              visitedMonuments: [
                ...state.visitedMonuments,
                {
                  id: monumentId,
                  visitCount: 1,
                  lastVisited: new Date().toISOString(),
                },
              ],
            };
          }
        });
      },
      
      getVisitCount: (monumentId: string) => {
        const monument = get().visitedMonuments.find(
          (m) => m.id === monumentId
        );
        return monument?.visitCount || 0;
      },
      
      clearHistory: () => {
        set({ visitedMonuments: [] });
      },
    }),
    {
      name: "historica-monument-storage",
    }
  )
);
