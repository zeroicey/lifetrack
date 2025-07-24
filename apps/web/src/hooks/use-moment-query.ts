import { apiGetMoments } from "@/api/moment";
import { useInfiniteQuery, type QueryKey } from "@tanstack/react-query";

const queryKey: QueryKey = ["list-moments"];

export const useMomentInfiniteQuery = () => {
    return useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => apiGetMoments({ cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: 0,
    });
};
