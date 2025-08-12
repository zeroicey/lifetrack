import type { TaskGroup } from "@/types/task";
import { format } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingState {
    currentTaskGroupName: string;
    currentTaskGroupId: number;
    currentTaskGroup: TaskGroup;
    isCurrentTaskGroupExists: boolean;
    setIsCurrentTaskGroupExists: (isCurrentTaskGroupExists: boolean) => void;
    setCurrentTaskGroupName: (currentTaskGroupName: string) => void;
    setCurrentTaskGroup: (currentTaskGroup: TaskGroup) => void;
    setCurrentTaskGroupId: (currentTaskGroupId: number) => void;
    clearCurrentTaskGroup: () => void;
}
export const useSettingStore = create<SettingState>()(
    persist(
        (set) => ({
            isCurrentTaskGroupExists: true,
            currentTaskGroupName: format(new Date(), "yyyy-MM-dd"),
            currentTaskGroupId: -1,
            currentTaskGroup: {
                id: -1,
                name: "",
                description: "",
                created_at: "",
                updated_at: "",
                type: "day",
            },
            setIsCurrentTaskGroupExists(isCurrentTaskGroupExists) {
                set(() => ({ isCurrentTaskGroupExists }));
            },
            setCurrentTaskGroupName(currentTaskGroupName) {
                set(() => ({ currentTaskGroupName }));
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
                        type: "day",
                        description: "",
                        created_at: "",
                        updated_at: "",
                    },
                })),
        }),
        {
            name: "setting-storage",
        }
    )
);
