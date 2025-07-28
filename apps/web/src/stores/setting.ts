import type { TaskGroup } from "@/types/task";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingState {
    currentTaskGroupId: number;
    currentTaskGroup: TaskGroup;
    setCurrentTaskGroup: (currentTaskGroup: TaskGroup) => void;
    setCurrentTaskGroupId: (currentTaskGroupId: number) => void;
    clearCurrentTaskGroup: () => void;
}
export const useSettingStore = create<SettingState>()(
    persist(
        (set) => ({
            currentTaskGroupId: -1,
            currentTaskGroup: {
                id: -1,
                name: "",
                description: "",
                created_at: "",
                updated_at: "",
            },
            setCurrentTaskGroup: (currentTaskGroup: TaskGroup) =>
                set(() => ({
                    currentTaskGroup,
                    currentTaskGroupId: currentTaskGroup.id,
                })),
            setCurrentTaskGroupId: (currentTaskGroupId: number) =>
                set(() => ({ currentTaskGroupId })),
            clearCurrentTaskGroup: () =>
                set(() => ({
                    currentTaskGroupId: -1,
                    currentTaskGroup: {
                        id: -1,
                        name: "",
                        description: "",
                        created_at: "",
                        updated_at: "",
                    },
                })),
        }),
        {
            name: "setting-storage", // 存储在 localStorage 中的键名
        }
    )
);
