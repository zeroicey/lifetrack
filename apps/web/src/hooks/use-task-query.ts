import {
    apiCreateTask,
    apiDeleteTask,
    apiGetTaskGroupByNameWithTasks,
    apiUpdateTask,
} from "@/api/task";
import { useTaskStore } from "@/stores/task";
import {
    type QueryKey,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

export const getTaskQueryKey = (taskGroupName: string): QueryKey => [
    "list-tasks",
    taskGroupName,
];

export const useTaskQuery = () => {
    const { currentTaskGroup, setCurrentTaskGroup, getCurrentTaskGroupName } =
        useTaskStore();
    return useQuery({
        queryKey: getTaskQueryKey(getCurrentTaskGroupName()),
        queryFn: async () => {
            const data = await apiGetTaskGroupByNameWithTasks(
                getCurrentTaskGroupName()
            );
            // Task group not found
            if (!data) return [];

            // Task group has no tasks
            console.log(data);
            setCurrentTaskGroup(data);
            console.log(currentTaskGroup);
            if (!data.tasks || data.tasks.length === 0) {
                return [];
            }
            return data.tasks;
        },
        retry: false,
        enabled: !!currentTaskGroup,
    });
};

export const useTaskUpdateMutation = () => {
    const queryClient = useQueryClient();
    const { getCurrentTaskGroupName } = useTaskStore();
    const taskQueryKey = getTaskQueryKey(getCurrentTaskGroupName());

    return useMutation({
        mutationFn: apiUpdateTask,
        onSuccess: () => {
            toast.success("Update task successfully!");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: taskQueryKey });
        },
        onError: () => {
            toast.error("Update task failed!");
            queryClient.invalidateQueries({ queryKey: taskQueryKey });
        },
    });
};

export const useTaskCreateMutation = () => {
    const queryClient = useQueryClient();
    const { getCurrentTaskGroupName } = useTaskStore();

    return useMutation({
        mutationFn: apiCreateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getTaskQueryKey(getCurrentTaskGroupName()),
            });
            toast.success("Create task successfully!");
        },
    });
};

export const useTaskDeleteMutation = () => {
    const queryClient = useQueryClient();
    const { getCurrentTaskGroupName } = useTaskStore();

    return useMutation({
        mutationFn: apiDeleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getTaskQueryKey(getCurrentTaskGroupName()),
            });
            toast.success("Delete task successfully!");
        },
        onError: () => {
            toast.error("Delete task failed!");
        },
    });
};
