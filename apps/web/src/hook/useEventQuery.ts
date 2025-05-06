import { createEvent, getAllEvents } from "@/api/event";
import { EventCreate } from "@lifetrack/request-types";
import { EventSelect } from "@lifetrack/response-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useEventQuery = () => {
  return useQuery({
    queryKey: ["list-event"],
    queryFn: () => getAllEvents(),
  });
};

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newEvent: EventCreate) => createEvent(newEvent),
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: ["list-event"] });

      const previousEvents = queryClient.getQueryData<EventSelect[]>([
        "list-event",
      ]);

      const optimisticEvent: EventSelect = {
        id: Date.now(), // 临时 ID
        content: newEvent.content,
        partyId: newEvent.partyId,
        happenedAt: new Date(), // 当前时间
      };

      queryClient.setQueryData<EventSelect[]>(["list-event"], (old) => {
        return old ? [...old, optimisticEvent] : [optimisticEvent];
      });

      // 返回回滚函数
      return () => {
        queryClient.setQueryData(["list-event"], previousEvents);
      };
    },
    onError: (_err, _newEvent, rollback) => {
      // 调用回滚函数
      rollback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["list-event"] });
    },
  });
};
