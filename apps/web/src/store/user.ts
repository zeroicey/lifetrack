import { UserSelect } from "@lifetrack/response-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  id: number;
  username: string;
  email: string;
  avatar: string;
  token: string;
  currentGroup: number;
  setCurrentGroup: (currentGroup: number) => void;
  setUser: (user: UserSelect) => void;
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
      currentGroup: -1,
      setCurrentGroup: (currentGroup: number) => set(() => ({ currentGroup })),
      setUser: (User: UserSelect) =>
        set(() => ({
          id: User.id,
          username: User.username,
          email: User.email,
          avatar:
            User.avatar ||
            `https://api.dicebear.com/7.x/pixel-art/svg?seed=${User.username}`,
        })),
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
