// src/store/navbar.ts
import { type ReactNode } from "react";
import { create } from "zustand";

interface NavbarStore {
    rightContent: ReactNode;
    setRightContent: (content: ReactNode) => void;
    clearRightContent: () => void;
}

export const useNavbarStore = create<NavbarStore>((set) => ({
    rightContent: null,
    setRightContent: (content) => set({ rightContent: content }),
    clearRightContent: () => set({ rightContent: null }),
}));
