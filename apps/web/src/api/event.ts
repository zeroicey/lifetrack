import http from "@/lib/http";
import { EventSelect } from "@lifetrack/response-types";

type Response<T> = {
  status: boolean;
  message: string;
  statusCode: number;
  data: T | null;
  errors: object | null;
};

export const getAllEvents = async () => {
  const res = await http.get<Response<EventSelect[]>>("event/events").json();
  return res.data;
};
