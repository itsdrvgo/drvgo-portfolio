import { create } from "zustand";

interface NavbarState {
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
}

export const useNavbarStore = create<NavbarState>((set) => ({
    isOpen: false,
    setIsOpen: (state) => set({ isOpen: state }),
}));
