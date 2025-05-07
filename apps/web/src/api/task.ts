import http, { Response } from "@/lib/http";
import { EventCreate } from "@lifetrack/request-types";
import { TaskGroupSelect, TaskSelect } from "@lifetrack/response-types";

export const getAllGroups = async () => {
  const res = await http.get<Response<TaskGroupSelect[]>>("task/groups").json();
  return res.data;
};

export const getTasksByGroupId = async (groupId: number) => {
  const res = await http
    .get<Response<TaskSelect[]>>(`task/groups/${groupId}/tasks`)
    .json();
  return res.data || [];
};

export const createEvent = async (data: EventCreate) => {
  const res = await http
    .post<Response<EventCreate>>("event/events", { json: data })
    .json();
  return res.data;
};
