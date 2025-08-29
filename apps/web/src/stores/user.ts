import type { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
    backendUrl: string | null;
    setBackendUrl: (url: string | null) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            token: null,
            setToken: (token) => set({ token }),
            logout: () => set({ user: null, token: null }),
            backendUrl: null,
            setBackendUrl(url) {
                set({ backendUrl: url });
            },
        }),
        {
            name: "user-storage",
        }
    )
);
