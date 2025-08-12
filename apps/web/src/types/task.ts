export type TaskGroup = {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
};

export type Task = {
    id: number;
    group_id: number;
    content: string;
    description: string;
    status: string;
    deadline: string;
    created_at: string;
    updated_at: string;
};

export type TaskGroupWithTasks = TaskGroup & {
    tasks: Task[];
};

export type TaskGroupCreate = {
    name: string;
    type: string;
    description: string;
};

export type TaskGroupUpdate = {
    id: number;
    name: string;
    description: string;
};

export type TaskCreate = {
    group_id: number;
    content: string;
    description?: string;
    deadline?: string;
};

export type TaskUpdate = {
    id: number;
    status?: string;
    content?: string;
    description?: string;
    deadline?: string;
};
