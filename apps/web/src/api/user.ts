import type { Response } from "@/lib/http";
import http from "@/lib/http";
import type {
    LoginBody,
    LoginResponse,
    RegisterBody,
    User,
} from "@/types/user";

export const apiUserRegister = async (data: RegisterBody) => {
    const res = await http
        .post<Response<User>>("user/register", {
            json: data,
        })
        .json();
    console.log(res);
    return res.data;
};

export const apiUserLogin = async (data: LoginBody) => {
    const res = await http
        .post<Response<LoginResponse>>("user/login", {
            json: data,
        })
        .json();
    if (!res.data) {
        throw new Error('Login failed: No data received');
    }
    return res.data;
};
