import {
    apiCreateTask,
    apiCreateTaskGroup,
    apiDeleteTaskGroup,
    apiGetTaskGroups,
    apiGetTaskGroupWithTasks,
    apiUpdateTask,
    apiUpdateTaskGroup,
} from "@/api/task";
import { useSettingStore } from "@/stores/setting";
import {
    type QueryKey,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

const queryGroupKey: QueryKey = ["list-groups"];

export const useGroupQuery = () => {
    return useQuery({
        queryKey: queryGroupKey,
        queryFn: () => apiGetTaskGroups(),
    });
};

export const useTasksQuery = () => {
    const { currentTaskGroupId } = useSettingStore();
    return useQuery({
        queryKey: ["list-tasks", currentTaskGroupId],
        queryFn: () => apiGetTaskGroupWithTasks(currentTaskGroupId),
        enabled: currentTaskGroupId !== -1,
    });
};

export const useTaskUpdateMutation = (
    options: { invalidate: boolean } = { invalidate: true }
) => {
    const queryClient = useQueryClient();
    const { currentTaskGroupId } = useSettingStore();
    const taskQueryKey = ["list-tasks", currentTaskGroupId];

    return useMutation({
        mutationFn: apiUpdateTask,
        onSuccess: () => {
            toast.success("Update task successfully!");
        },
        onSettled: () => {
            if (options.invalidate) {
                queryClient.invalidateQueries({ queryKey: taskQueryKey });
            }
        },
        onError: () => {
            toast.error("Update task failed!");
            queryClient.invalidateQueries({ queryKey: taskQueryKey });
        },
    });
};

export const useTaskCreateMutation = () => {
    const queryClient = useQueryClient();
    const { currentTaskGroupId } = useSettingStore();

    return useMutation({
        mutationFn: apiCreateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["list-tasks", currentTaskGroupId],
            });
            toast.success("Create task successfully!");
        },
    });
};

export const useGroupCreateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiCreateTaskGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryGroupKey });
            toast.success("Create task group successfully!");
        },
    });
};

export const useGroupDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiDeleteTaskGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryGroupKey });
            toast.success("Delete task group successfully!");
        },
    });
};

export const useGroupUpdateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiUpdateTaskGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryGroupKey });
            toast.success("Update task group successfully!");
        },
    });
};
