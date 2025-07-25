import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingState {
    currentTaskGroupId: number;
    setCurrentTaskGroupId: (currentTaskGroupId: number) => void;
}
export const useSettingStore = create<SettingState>()(
    persist(
        (set) => ({
            currentTaskGroupId: -1,
            setCurrentTaskGroupId: (currentTaskGroupId: number) =>
                set(() => ({ currentTaskGroupId })),
        }),
        {
            name: "setting-storage", // 存储在 localStorage 中的键名
        }
    )
);
