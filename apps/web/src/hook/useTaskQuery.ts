import { getAllGroups, getTasksByGroupId } from "@/api/task";
import { useQuery } from "@tanstack/react-query";

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
