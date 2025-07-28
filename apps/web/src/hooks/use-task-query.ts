import {
    apiCreateTask,
    apiDeleteTask,
    apiGetTaskGroupWithTasks,
    apiUpdateTask,
} from "@/api/task";
import { useSettingStore } from "@/stores/setting";
import {
    type QueryKey,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

export const getTaskQueryKey = (taskGroupId: number): QueryKey => [
    "list-tasks",
    taskGroupId,
];

export const useTaskQuery = () => {
    const { currentTaskGroupId } = useSettingStore();
    return useQuery({
        queryKey: getTaskQueryKey(currentTaskGroupId),
        queryFn: () => apiGetTaskGroupWithTasks(currentTaskGroupId),
        enabled: currentTaskGroupId !== -1,
    });
};

export const useTaskUpdateMutation = (
    options: { invalidate: boolean } = { invalidate: true }
) => {
    const queryClient = useQueryClient();
    const { currentTaskGroupId } = useSettingStore();
    const taskQueryKey = getTaskQueryKey(currentTaskGroupId);

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
                queryKey: getTaskQueryKey(currentTaskGroupId),
            });
            toast.success("Create task successfully!");
        },
    });
};

export const useTaskDeleteMutation = () => {
    const queryClient = useQueryClient();
    const { currentTaskGroupId } = useSettingStore();

    return useMutation({
        mutationFn: apiDeleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getTaskQueryKey(currentTaskGroupId),
            });
            toast.success("Delete task successfully!");
        },
        onError: () => {
            toast.error("Delete task failed!");
        },
    });
};
