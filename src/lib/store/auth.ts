import { create } from "zustand";

interface AuthState {
    isAuthLoading: boolean;
    setAuthLoading: (value: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthLoading: false,
    setAuthLoading: (value) => set({ isAuthLoading: value }),
}));

export default useAuthStore;
