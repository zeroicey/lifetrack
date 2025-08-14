import { genNameFromType } from "@/utils/task";
import { create } from "zustand";

interface TaskState {
    selectedTaskGroupName: string;
    setSelectedTaskGroupName: (name: string) => void;
}
export const useTaskStore = create<TaskState>()((set) => ({
    selectedTaskGroupName: genNameFromType("day"),
    setSelectedTaskGroupName: (name) => set({ selectedTaskGroupName: name }),
}));
