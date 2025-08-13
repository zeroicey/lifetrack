import type { TaskGroup, TaskGroupType } from "@/types/task";
import { format } from "date-fns";
import { create } from "zustand";

interface TaskState {
    currentTaskGroup: TaskGroup | null;
    setCurrentTaskGroup: (g: TaskGroup | null) => void;
    getCurrentTaskGroupName: () => string;
    getCurrentTaskGroupType: () => TaskGroupType;
}
export const useTaskStore = create<TaskState>()((set, get) => ({
    currentTaskGroup: null,
    getCurrentTaskGroupName() {
        return get().currentTaskGroup?.name ?? format(new Date(), "yyyy-MM-dd");
    },
    getCurrentTaskGroupType() {
        return get().currentTaskGroup?.type ?? "day";
    },
    setCurrentTaskGroup(g) {
        set(() => ({ currentTaskGroup: g }));
    },
}));
