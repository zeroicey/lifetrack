import {
    type QueryKey,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";
import { apiCreateHabit, apiGetHabits } from "@/api/habit";

const queryKey: QueryKey = ["list-habits"];

export const useHabitQuery = () => {
    return useQuery({
        queryKey: queryKey,
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
            queryClient.invalidateQueries({ queryKey });
        },
    });
};
