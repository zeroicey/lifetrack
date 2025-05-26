import http, { Response } from "@/lib/http";
import { useUserStore } from "@/store/user";
import {
  TaskCreate,
  TaskGroupCreate,
  TaskGroupUpdate,
} from "@lifetrack/request-types";
import { TaskGroupSelect, TaskSelect } from "@lifetrack/response-types";

export const getAllGroups = async () => {
  const res = await http.get<Response<TaskGroupSelect[]>>("task/groups").json();
  if (res.data && res.data.length > 0) {
    useUserStore.getState().setCurrentGroup(res.data[0].id);
  }
  return res.data || [];
};

export const getTasksByGroupId = async (groupId: number) => {
  if (groupId === -1) {
    return [];
  }
  const res = await http
    .get<Response<TaskSelect[]>>(`task/groups/${groupId}/tasks`)
    .json();
  return res.data || [];
};

export const deleteGroup = async (groupId: number) => {
  const res = await http
    .delete<Response<void>>(`task/groups/${groupId}`)
    .json();
  return res.data;
};

export const updateGroup = async ({ name, groupId }: TaskGroupUpdate) => {
  const res = await http
    .put<Response<TaskGroupSelect>>(`task/groups/${groupId}`, {
      json: { name },
    })
    .json();
  return res.data;
};

export const createGroup = async (data: TaskGroupCreate) => {
  const res = await http
    .post<Response<TaskGroupSelect>>("task/groups", { json: data })
    .json();
  return res.data;
};

export const createTask = async (data: TaskCreate) => {
  const res = await http
    .post<Response<TaskSelect>>(`task/tasks`, { json: data })
    .json();

  return res.data;
};
