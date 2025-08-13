import type { TaskGroup } from "@/types/task";
import { create } from "zustand";

interface TaskState {
    currentTaskGroup: TaskGroup | null;
    setCurrentTaskGroup: (currentTaskGroup: TaskGroup | null) => void;
}
export const useTaskStore = create<TaskState>()((set) => ({
    currentTaskGroup: null,
    setCurrentTaskGroup(currentTaskGroup) {
        set(() => ({ currentTaskGroup }));
    },
}));
