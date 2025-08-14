import {
    apiCreateTaskGroup,
    apiDeleteTaskGroup,
    apiGetTaskGroupsByType,
    apiUpdateTaskGroup,
} from "@/api/task";
import {
    type QueryKey,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";
import { getTaskQueryKey } from "./use-task-query";
import { useTaskStore } from "@/stores/task";

const queryGroupKey: QueryKey = ["list-groups"];

export const useTaskCustomGroupQuery = () => {
    return useQuery({
        queryKey: queryGroupKey,
        queryFn: () => apiGetTaskGroupsByType("custom"),
    });
};

export const useTaskGroupCreateMutation = () => {
    const queryClient = useQueryClient();
    const { selectedTaskGroupName } = useTaskStore();
    return useMutation({
        mutationFn: apiCreateTaskGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getTaskQueryKey(selectedTaskGroupName),
            });
            toast.success("Create task group successfully!");
        },
    });
};

export const useTaskGroupDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiDeleteTaskGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryGroupKey });
            toast.success("Delete task group successfully!");
        },
    });
};

export const useTaskGroupUpdateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiUpdateTaskGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryGroupKey });
            toast.success("Update task group successfully!");
        },
    });
};
