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
    const { selectedTaskGroupName } = useTaskStore();
    return useQuery({
        queryKey: getTaskQueryKey(selectedTaskGroupName),
        queryFn: async () =>
            apiGetTaskGroupByNameWithTasks(selectedTaskGroupName),
    });
};

export const useTaskUpdateMutation = () => {
    const queryClient = useQueryClient();
    const { selectedTaskGroupName } = useTaskStore();
    const taskQueryKey = getTaskQueryKey(selectedTaskGroupName);

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
    const { selectedTaskGroupName } = useTaskStore();

    return useMutation({
        mutationFn: apiCreateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getTaskQueryKey(selectedTaskGroupName),
            });
            toast.success("Create task successfully!");
        },
    });
};

export const useTaskDeleteMutation = () => {
    const queryClient = useQueryClient();
    const { selectedTaskGroupName } = useTaskStore();

    return useMutation({
        mutationFn: apiDeleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getTaskQueryKey(selectedTaskGroupName),
            });
            toast.success("Delete task successfully!");
        },
        onError: () => {
            toast.error("Delete task failed!");
        },
    });
};
