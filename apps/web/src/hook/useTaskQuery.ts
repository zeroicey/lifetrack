import {
  createGroup,
  createTask,
  getAllGroups,
  getTasksByGroupId,
} from "@/api/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGroupQuery = () => {
  return useQuery({
    queryKey: ["list-group"],
    queryFn: () => getAllGroups(),
  });
};

export const useTasksQuery = (id: number) => {
  return useQuery({
    queryKey: ["group-with-tasks", id],
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
    },
  });
};

export const useTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-group"] });
    },
  });
};
