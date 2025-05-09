import {
  createGroup,
  createTask,
  getAllGroups,
  getTasksByGroupId,
} from "@/api/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGroupQuery = () => {
  return useQuery({
    queryKey: ["list-group"],
    queryFn: () => getAllGroups(),
  });
};

export const useTasksQuery = (id: number) => {
  return useQuery({
    queryKey: ["list-task", id],
    queryFn: () => getTasksByGroupId(id),
    enabled: !!id, // 确保 id 存在时才执行查询
  });
};

export const useGroupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-group"] });
      toast.success("Create task group successfully!");
    },
  });
};

export const useTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-task"] });
      toast.success("Create task successfully!");
    },
  });
};
