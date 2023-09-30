import { create } from "zustand";

interface SidebarState {
    isSidebarOpen: boolean;
    setSidebarOpen: (value: boolean) => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
    isSidebarOpen: true,
    setSidebarOpen: (value) => set({ isSidebarOpen: value }),
}));

export default useSidebarStore;
