import http, { Response } from "@/lib/http";
import { UserCreate } from "@lifetrack/request-types";
import { UserSelect } from "@lifetrack/response-types";

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
): Promise<
  Response<{ access_token: string; refresh_token: string; user: UserSelect }>
> => {
  console.log(nameOrEmail, password);
  return await http
    .post("auth/login", {
      json: { nameOrEmail, password },
    })
    .json();
};
