import { create } from "zustand";

interface SideBarState {
    isSidebarOpen: boolean;
    setSidebarOpen: (value: boolean) => void;
}

const useSidebarStore = create<SideBarState>((set) => ({
    isSidebarOpen: true,
    setSidebarOpen: (value) => set({ isSidebarOpen: value }),
}));

export default useSidebarStore;
