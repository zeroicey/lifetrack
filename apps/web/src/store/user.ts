import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  id: number | null;
  username: string | null;
  email: string | null;
  avatar: string | null;
  setId: (id: number) => void;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setAvatar: (avatar: string) => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: null,
      username: null,
      email: null,
      avatar: null,
      setId: (id: number) => set(() => ({ id })),
      setUsername: (username: string) => set(() => ({ username })),
      setEmail: (email: string) => set(() => ({ email })),
      setAvatar: (avatar: string) => set(() => ({ avatar })),
    }),
    {
      name: "user-storage", // 存储在 localStorage 中的键名
    }
  )
);
