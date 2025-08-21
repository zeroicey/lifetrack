import {
    type QueryKey,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";
import { apiCreateEvent, apiGetEvents } from "@/api/event";

const queryKey: QueryKey = ["list-events"];

export const useEventQuery = () => {
    return useQuery({
        queryKey: queryKey,
        queryFn: apiGetEvents,
    });
};

export const useEventCreateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiCreateEvent,
        onSuccess: () => {
            toast.success("Create moment with attachments successfully!");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};
