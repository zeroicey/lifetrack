import http, { Response } from "@/lib/http";
import { TaskCreate, TaskGroupCreate } from "@lifetrack/request-types";
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

export const createGroup = async (data: TaskGroupCreate) => {
  const res = await http
    .post<Response<TaskGroupCreate>>("task/groups", { json: data })
    .json();
  return res.data;
};

export const createTask = async (data: TaskCreate) => {
  const res = await http
    .post<Response<TaskCreate>>(`task/tasks`, { json: data })
    .json();

  return res.data;
};
