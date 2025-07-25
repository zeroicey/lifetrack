import type { Response } from "@/lib/http";
import http from "@/lib/http";
import type {
    Task,
    TaskCreate,
    TaskGroup,
    TaskGroupCreate,
    TaskGroupUpdate,
    TaskGroupWithTasks,
} from "@/types/task";

export const apiGetTaskGroupWithTasks = async (id: number) => {
    const res = await http
        .get<Response<TaskGroupWithTasks>>(`task-groups/${id}`)
        .json();
    return res.data?.tasks;
};

export const apiGetTaskGroups = async () => {
    const res = await http.get<Response<TaskGroup[]>>("task-groups").json();
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
        .patch<Response<TaskGroup>>(`task-groups/${id}`, {
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
