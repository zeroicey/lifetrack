import http, { Response } from "@/lib/http";
import { UserCreate } from "@lifetrack/request-types";

export const registerAuth = async (
  data: UserCreate
): Promise<Response<null>> => {
  return await http
    .post<Response<null>>("auth/register", { json: data })
    .json();
};

export const loginAuth = async (
  nameOrEmail: string,
  password: string
): Promise<Response<{ accessToken: string }>> => {
  console.log(nameOrEmail, password);
  return await http
    .post<Response<{ accessToken: string }>>("auth/login", {
      json: { nameOrEmail, password },
    })
    .json();
};
