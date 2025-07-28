import type { Response } from "@/lib/http";
import http from "@/lib/http";
import { useSettingStore } from "@/stores/setting";
import type {
    Task,
    TaskCreate,
    TaskGroup,
    TaskGroupCreate,
    TaskGroupUpdate,
    TaskGroupWithTasks,
    TaskUpdate,
} from "@/types/task";

export const apiGetTaskGroupWithTasks = async (id: number) => {
    const res = await http
        .get<Response<TaskGroupWithTasks>>(`task-groups/${id}`)
        .json();
    return res.data?.tasks;
};

export const apiGetTaskGroups = async () => {
    const res = await http.get<Response<TaskGroup[]>>("task-groups").json();
    if (
        res.data &&
        res.data.length > 0 &&
        useSettingStore.getState().currentTaskGroupId === -1
    ) {
        useSettingStore.getState().setCurrentTaskGroup(res.data[0]);
    }
    return res.data;
};

export const apiUpdateTask = async (task: TaskUpdate) => {
    const res = await http
        .put<Response<Task>>(`tasks/${task.id}`, {
            json: task,
        })
        .json();
    return res.data;
};

export const apiCreateTask = async (task: TaskCreate) => {
    const res = await http
        .post<Response<Task>>("tasks", {
            json: task,
        })
        .json();
    return res.data;
};

export const apiCreateTaskGroup = async ({
    name,
    description,
}: TaskGroupCreate) => {
    const res = await http
        .post<Response<TaskGroup>>("task-groups", {
            json: { name, description },
        })
        .json();
    return res.data;
};

export const apiUpdateTaskGroup = async ({
    id,
    name,
    description,
}: TaskGroupUpdate) => {
    const res = await http
        .put<Response<TaskGroup>>(`task-groups/${id}`, {
            json: { name, description },
        })
        .json();
    return res.data;
};

export const apiDeleteTaskGroup = async (id: number) => {
    const res = await http
        .delete<Response<TaskGroup>>(`task-groups/${id}`)
        .json();
    return res.data;
};

export const apiDeleteTask = async (id: number) => {
    const res = await http.delete<Response<Task>>(`tasks/${id}`).json();
    return res.data;
};
