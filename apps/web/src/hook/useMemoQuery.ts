import { createMemo, getAllMemos } from "@/api/memo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMemoQuery = () => {
  return useQuery({
    queryKey: ["list-memo"],
    queryFn: () => getAllMemos(),
  });
};

export const useMemoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMemo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-memo"] }),
        toast.success("Create memo successfully!");
    },
  });
};
