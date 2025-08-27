import {
    type QueryKey,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";
import {
    apiCreateHabit,
    apiCreateHabitLog,
    apiDeleteHabit,
    apiGetHabitLogs,
    apiGetHabits,
} from "@/api/habit";

const queryHabitKey: QueryKey = ["list-habits"];
const queryHabitLogKey: QueryKey = ["list-habit-logs"];

export const useHabitQuery = () => {
    return useQuery({
        queryKey: queryHabitKey,
        queryFn: apiGetHabits,
    });
};

export const useHabitCreateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiCreateHabit,
        onSuccess: () => {
            toast.success("Create habit successfully!");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryHabitKey });
        },
    });
};

export const useHabitLogCreateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiCreateHabitLog,
        onSuccess: () => {
            toast.success("Create habit log successfully!");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryHabitLogKey });
            queryClient.invalidateQueries({ queryKey: queryHabitKey });
        },
    });
};

export const useHabitLogQuery = () => {
    return useQuery({
        queryKey: queryHabitLogKey,
        queryFn: apiGetHabitLogs,
    });
};

export const useHabitDeleteMutation = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => apiDeleteHabit(id),
        onSuccess: () => {
            toast.success("Delete habit successfully!");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryHabitKey });
            queryClient.invalidateQueries({ queryKey: queryHabitLogKey });
        },
    });
};
