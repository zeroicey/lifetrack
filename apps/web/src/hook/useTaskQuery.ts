import { getAllEvents } from "@/api/event";
import { EventSelect } from "@lifetrack/response-types";
import { useQuery } from "@tanstack/react-query";

// 查询单个用户
export const useGroupQuery = () => {
  return useQuery({
    queryKey: ["list-group"],
    queryFn: () => getAllEvents(),
  });
};
