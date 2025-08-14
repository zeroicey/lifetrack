import type { Response } from "@/lib/http";
import http from "@/lib/http";
import type {
    Task,
    TaskCreate,
    TaskGroup,
    TaskGroupCreate,
    TaskGroupType,
    TaskGroupUpdate,
    TaskGroupWithTasks,
    TaskUpdate,
} from "@/types/task";

export const apiGetTaskGroupByNameWithTasks = async (name: string) => {
    const res = await http
        .get<Response<TaskGroupWithTasks[]>>(
            `task-groups?name=${name}&with_tasks=true`
        )
        .json();

    return res.data;
};

export const apiGetTaskGroupByName = async (name: string) => {
    const res = await http
        .get<Response<TaskGroupWithTasks>>(`task-groups/${name}`)
        .json();

    return res.data;
};

export const apiGetTaskGroupsByType = async (type: TaskGroupType) => {
    const res = await http
        .get<Response<TaskGroup[]>>(`task-groups?type=${type}`)
        .json();
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
    type,
}: TaskGroupCreate) => {
    const res = await http
        .post<Response<TaskGroup>>("task-groups", {
            json: { name, description, type },
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
