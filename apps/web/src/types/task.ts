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
    pos: string;
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
    description: string;
};

export type TaskGroupUpdate = {
    id: number;
    name: string;
    description: string;
};
