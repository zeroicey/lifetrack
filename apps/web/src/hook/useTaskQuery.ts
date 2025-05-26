import {
  createGroup,
  createTask,
  deleteGroup,
  deleteTask,
  getAllGroups,
  getTasksByGroupId,
  updateGroup,
} from "@/api/task";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

const queryGroupKey: QueryKey = ["list-group"];

export const useGroupQuery = () => {
  return useQuery({
    queryKey: queryGroupKey,
    queryFn: () => getAllGroups(),
  });
};

export const useTaskDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-task"] });
      toast.success("Delete task successfully!");
    },
  });
};

export const useTasksQuery = (id: number) => {
  return useQuery({
    queryKey: ["list-task", id],
    queryFn: () => getTasksByGroupId(id),
    enabled: !!id, // 确保 id 存在时才执行查询
  });
};

export const useGroupCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-group"] });
      toast.success("Create task group successfully!");
    },
  });
};

export const useGroupUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGroup,
    onSuccess: () => {
      toast.success("Update group successfully!");
    },
    onError: (error, variables, context) => {
      toast.error("Update memo failed!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryGroupKey });
    },
  });
};

export const useGroupDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-group"] });
      toast.success("Delete task group successfully!");
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
