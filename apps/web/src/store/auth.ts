import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access_token: null,
      refresh_token: null,
      setAccessToken: (token: string) => set(() => ({ access_token: token })),
      setRefreshToken: (token: string) => set(() => ({ refresh_token: token })),
    }),
    {
      name: "auth-storage", // 存储在 localStorage 中的键名
    }
  )
);
