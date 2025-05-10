import { createMemo, deleteMemo, getMemos, updateMemo } from "@/api/memo";
import { MemoSelect } from "@lifetrack/response-types";
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

const queryKey: QueryKey = ["list-memo"];

export const useMemoInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getMemos({ cursor: pageParam }), // 使用 pageParam 作为 cursor
    getNextPageParam: (lastPage) => lastPage.nextCursor, // 如果有 nextCursor, 则表示还有下一页
    initialPageParam: 0,
  });
};

export const useMemoCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMemo,
    onSuccess: () => {
      toast.success("Create memo successfully!");
    },
    onMutate: async (newMemo) => {
      await queryClient.cancelQueries({ queryKey });
      const previousMemos = queryClient.getQueryData<
        InfiniteData<
          {
            items: MemoSelect[];
            nextCursor: number | null;
          },
          number | undefined
        >
      >(queryKey);

      console.log("previousMemos", previousMemos);
      const optimisticMemo: MemoSelect = {
        ...newMemo,
        id: Math.random(), // 使用随机数作为临时 ID
        createdAt: new Date(),
        updatedAt: new Date(),
        attachs: null,
      };

      queryClient.setQueryData<
        InfiniteData<
          {
            items: MemoSelect[];
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
                items: [optimisticMemo, ...firstPage.items],
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      });

      console.log("previousMemos", previousMemos);
      return { previousMemos };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousMemos);
      toast.error("Create memo failed!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useMemoDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMemo,
    onSuccess: () => {
      toast.success("Delete memo successfully!");
    },
    onMutate: async (memoId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousMemos = queryClient.getQueryData<
        InfiniteData<
          {
            items: MemoSelect[];
            nextCursor: number | null;
          },
          number | undefined
        >
      >(queryKey);

      queryClient.setQueryData<
        InfiniteData<
          {
            items: MemoSelect[];
            nextCursor: number | null;
          },
          number | undefined
        >
      >(queryKey, (oldData) => {
        const firstPage = oldData?.pages[0];
        if (firstPage) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => item.id !== memoId),
            })),
          };
        }
      });

      return { previousMemos };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousMemos);
      toast.error("Delete memo failed!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useMemoUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMemo,
    onSuccess: () => {
      toast.success("Update memo successfully!");
    },
    onMutate: async ({ memoId, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousMemos = queryClient.getQueryData<
        InfiniteData<
          {
            items: MemoSelect[];
            nextCursor: number | null;
          },
          number | undefined
        >
      >(queryKey);

      queryClient.setQueryData<
        InfiniteData<
          {
            items: MemoSelect[];
            nextCursor: number | null;
          },
          number | undefined
        >
      >(queryKey, (oldData) => {
        const firstPage = oldData?.pages[0];
        if (firstPage) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === memoId ? { ...item, ...data } : item
              ),
            })),
          };
        }
      });

      return { previousMemos };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousMemos);
      toast.error("Update memo failed!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
