import { create } from 'zustand';
import { createJSONStorage, persist, devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  rating?: string;
  distance?: string;
  category?: string;
  isSelected?: boolean;
}

interface Hotel {
  id: string;
  name: string;
  description?: string;
  location: {
    coordinates: [number, number];
    address: string;
  };
  price?: number;
  rating?: number;
  images?: string[];
}

interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: string;
  idType?: string;
  idNumber?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  password: string;
}

interface TravelPlan {
  id: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  selectedLocations: Location[];
  selectedHotel?: Hotel;
  passengers: Passenger[];
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  budget?: number;
  notes?: string;
}

interface PlanStore {
  currentPlan: TravelPlan;
  user: User | null;

  setUser: (user: User) => void;
  getUser: () => User | null;
  clearUser: () => void;

  addLocation: (location: Location) => void;
  removeLocation: (locationId: string) => void;
  updateLocation: (locationId: string, updates: Partial<Location>) => void;

  setHotel: (hotel: Hotel) => void;
  removeHotel: () => void;
  updateHotel: (updates: Partial<Hotel>) => void;

  addPassenger: (passenger: Passenger) => void;
  removePassenger: (passengerId: string) => void;
  updatePassenger: (passengerId: string, updates: Partial<Passenger>) => void;

  updatePlanDetails: (updates: Partial<TravelPlan>) => void;
  resetPlan: () => void;

  clearPersistedState: () => void;
  loadSavedPlan: () => Promise<void>;
  savePlan: () => Promise<void>;
}

const initialState: TravelPlan = {
  id: Date.now().toString(),
  selectedLocations: [],
  passengers: [],
};

export const usePlanStore = create<PlanStore>()(
  devtools(
    persist(
      (set, get) => ({
        currentPlan: initialState,
        user: null,

        setUser: (user) => set({ user }),
        getUser: () => get().user,

        clearUser: () => set({ user: null }),

        addLocation: (location) =>
          set((state) => ({
            currentPlan: {
              ...state.currentPlan,
              selectedLocations: [
                ...state.currentPlan.selectedLocations,
                { ...location, isSelected: true },
              ],
            },
          })),

        removeLocation: (locationId) =>
          set((state) => ({
            currentPlan: {
              ...state.currentPlan,
              selectedLocations: state.currentPlan.selectedLocations.filter(
                (loc) => loc.id !== locationId
              ),
            },
          })),

        updateLocation: (locationId, updates) =>
          set((state) => ({
            currentPlan: {
              ...state.currentPlan,
              selectedLocations: state.currentPlan.selectedLocations.map((loc) =>
                loc.id === locationId ? { ...loc, ...updates } : loc
              ),
            },
          })),

        setHotel: (hotel) =>
          set((state) => {
            const newState = {
              ...state.currentPlan,
              selectedHotel: hotel,
            };
            AsyncStorage.setItem(
              'travel-plan-storage',
              JSON.stringify({ state: { currentPlan: newState } })
            );
            return { currentPlan: newState };
          }),

        removeHotel: () =>
          set((state) => ({
            currentPlan: {
              ...state.currentPlan,
              selectedHotel: undefined,
            },
          })),

        updateHotel: (updates) =>
          set((state) => ({
            currentPlan: {
              ...state.currentPlan,
              selectedHotel: state.currentPlan.selectedHotel
                ? { ...state.currentPlan.selectedHotel, ...updates }
                : undefined,
            },
          })),

        addPassenger: (passenger) =>
          set((state) => ({
            currentPlan: {
              ...state.currentPlan,
              passengers: [...state.currentPlan.passengers, passenger],
            },
          })),

        removePassenger: (passengerId) =>
          set((state) => ({
            currentPlan: {
              ...state.currentPlan,
              passengers: state.currentPlan.passengers.filter((p) => p.id !== passengerId),
            },
          })),

        updatePassenger: (passengerId, updates) =>
          set((state) => ({
            currentPlan: {
              ...state.currentPlan,
              passengers: state.currentPlan.passengers.map((p) =>
                p.id === passengerId ? { ...p, ...updates } : p
              ),
            },
          })),

        updatePlanDetails: (updates) =>
          set((state) => ({
            currentPlan: {
              ...state.currentPlan,
              ...updates,
            },
          })),

        resetPlan: () => {
          set({
            currentPlan: {
              ...initialState,
              id: Date.now().toString(),
            },
          });
        },

        clearPersistedState: () => {
          AsyncStorage.removeItem('travel-plan-storage');
          set({ currentPlan: initialState });
        },

        loadSavedPlan: async () => {
          try {
            const savedPlan = await AsyncStorage.getItem('travel-plan-storage');
            if (savedPlan) {
              const parsedPlan = JSON.parse(savedPlan);
              set({ currentPlan: parsedPlan.state.currentPlan });
            }
          } catch (error) {
            console.error('Error loading saved plan:', error);
          }
        },

        savePlan: async () => {
          try {
            const currentState = get().currentPlan;
            await AsyncStorage.setItem(
              'travel-plan-storage',
              JSON.stringify({ state: { currentPlan: currentState } })
            );
          } catch (error) {
            console.error('Error saving plan:', error);
          }
        },
      }),
      {
        name: 'travel-plan-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          currentPlan: state.currentPlan,
          user: state.user,
        }),
      }
    )
  )
);
