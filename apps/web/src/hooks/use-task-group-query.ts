import {
    apiCreateTaskGroup,
    apiDeleteTaskGroup,
    apiGetTaskGroups,
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

export const useTaskGroupQuery = () => {
    return useQuery({
        queryKey: queryGroupKey,
        queryFn: () => apiGetTaskGroups(),
    });
};

export const useTaskGroupCreateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiCreateTaskGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryGroupKey });
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
