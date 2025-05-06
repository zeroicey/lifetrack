import http, { Response } from "@/lib/http";
import { EventCreate } from "@lifetrack/request-types";
import { EventSelect } from "@lifetrack/response-types";

export const getAllGroups = async () => {
  const res = await http.get<Response<EventSelect[]>>("event/events").json();
  return res.data;
};

export const getEventById = async (id: string) => {
  const res = await http
    .get<Response<EventSelect>>(`event/events/${id}`)
    .json();
  return res.data;
};

export const createEvent = async (data: EventCreate) => {
  const res = await http
    .post<Response<EventCreate>>("event/events", { json: data })
    .json();
  return res.data;
};
