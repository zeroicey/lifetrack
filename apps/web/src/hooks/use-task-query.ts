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
import { format } from "date-fns";

import { toast } from "sonner";

export const getTaskQueryKey = (taskGroupName: string): QueryKey => [
    "list-tasks",
    taskGroupName,
];

export const useTaskQuery = () => {
    const { currentTaskGroup } = useTaskStore();
    const taskGroupName =
        currentTaskGroup?.name || format(new Date(), "yyyy-MM-dd");
    return useQuery({
        queryKey: getTaskQueryKey(taskGroupName),
        queryFn: () => apiGetTaskGroupByNameWithTasks(taskGroupName),
        retry: false,
        enabled: !!currentTaskGroup,
    });
};

export const useTaskUpdateMutation = () => {
    const queryClient = useQueryClient();
    const { currentTaskGroup } = useTaskStore();
    const taskGroupName =
        currentTaskGroup?.name || format(new Date(), "yyyy-MM-dd");
    const taskQueryKey = getTaskQueryKey(taskGroupName);

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
    const { currentTaskGroup } = useTaskStore();

    const taskGroupName =
        currentTaskGroup?.name || format(new Date(), "yyyy-MM-dd");

    return useMutation({
        mutationFn: apiCreateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getTaskQueryKey(taskGroupName),
            });
            toast.success("Create task successfully!");
        },
    });
};

export const useTaskDeleteMutation = () => {
    const queryClient = useQueryClient();
    const { currentTaskGroup } = useTaskStore();

    const taskGroupName =
        currentTaskGroup?.name || format(new Date(), "yyyy-MM-dd");

    return useMutation({
        mutationFn: apiDeleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getTaskQueryKey(taskGroupName),
            });
            toast.success("Delete task successfully!");
        },
        onError: () => {
            toast.error("Delete task failed!");
        },
    });
};
