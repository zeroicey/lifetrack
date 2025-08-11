import { apiCreateMoment, apiDeleteMoment, apiGetMoments } from "@/api/moment";
import type { Moment } from "@/types/moment";
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
    type InfiniteData,
    type QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

const queryKey: QueryKey = ["list-moments"];

export const useMomentInfiniteQuery = () => {
    return useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => apiGetMoments({ cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: 0,
    });
};

export const useMomentCreateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiCreateMoment,
        onSuccess: () => {
            toast.success("Create moment successfully!");
        },
        onMutate: async (newMoment) => {
            await queryClient.cancelQueries({ queryKey });
            const previousMoments = queryClient.getQueryData<
                InfiniteData<
                    {
                        items: Moment[];
                        nextCursor: number | null;
                    },
                    number | undefined
                >
            >(queryKey);

            const optimisticMoment: Moment = {
                content: newMoment.content || "",
                id: Math.random(), // 使用随机数作为临时 ID
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            queryClient.setQueryData<
                InfiniteData<
                    {
                        items: Moment[];
                        nextCursor: number | null;
                    },
                    number | undefined
                >
            >(queryKey, (oldData) => {
                const firstPage = oldData?.pages[0];
                if (firstPage) {
                    return {
                        ...oldData,
                        pages: [
                            {
                                ...firstPage,
                                items: [optimisticMoment, ...firstPage.items],
                            },
                            ...oldData.pages.slice(1),
                        ],
                    };
                }
            });

            return { previousMoments };
        },
        onError: (_error, _variables, context) => {
            queryClient.setQueryData(queryKey, context?.previousMoments);
            toast.error("Create moment failed!");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};

export const useMomentDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiDeleteMoment,
        onSuccess: () => {
            toast.success("Delete moment successfully!");
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey });
            const previousMoments = queryClient.getQueryData<
                InfiniteData<
                    {
                        items: Moment[];
                        nextCursor: number | null;
                    },
                    number | undefined
                >
            >(queryKey);

            queryClient.setQueryData<
                InfiniteData<
                    {
                        items: Moment[];
                        nextCursor: number | null;
                    },
                    number | undefined
                >
            >(queryKey, (oldData) => {
                const firstPage = oldData?.pages[0];
                if (firstPage) {
                    return {
                        ...oldData,
                        pages: [
                            {
                                ...firstPage,
                                items: firstPage.items.filter(
                                    (item) => item.id !== id
                                ),
                            },
                            ...oldData.pages.slice(1),
                        ],
                    };
                }
            });

            return { previousMoments };
        },
        onError: (_error, _variables, context) => {
            queryClient.setQueryData(queryKey, context?.previousMoments);
            toast.error("Delete moment failed!");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};
