import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  id: number;
  username: string;
  email: string;
  avatar: string;
  token: string;
  setId: (id: number) => void;
  setToken: (token: string) => void;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setAvatar: (avatar: string) => void;
  logout: () => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: -1,
      username: "guide",
      email: "guide@lifetrack.cc",
      avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=guide",
      token: "unauthenticated",
      setToken: (token: string) => set(() => ({ token })),
      setId: (id: number) => set(() => ({ id })),
      setUsername: (username: string) => set(() => ({ username })),
      setEmail: (email: string) => set(() => ({ email })),
      setAvatar: (avatar: string) => set(() => ({ avatar })),
      logout: () =>
        set(() => ({
          token: "unauthenticated",
          id: -1,
          username: "guide",
          email: "guide@lifetrack.cc",
          avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=guide",
        })),
    }),
    {
      name: "user-storage", // 存储在 localStorage 中的键名
    }
  )
);
