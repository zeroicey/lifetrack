import {
    apiCreateTaskGroup,
    apiDeleteTaskGroup,
    apiGetTaskGroups,
    apiGetTaskGroupWithTasks,
    apiUpdateTaskGroup,
} from "@/api/task";
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

export const useTasksQuery = (group_id: number) => {
    return useQuery({
        queryKey: ["list-tasks", group_id],
        queryFn: () => apiGetTaskGroupWithTasks(group_id),
        enabled: !!group_id,
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
