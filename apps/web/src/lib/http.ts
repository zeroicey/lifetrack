// lib/http.ts
import { useAuthStore } from "@/store/auth";
import ky from "ky";

export type Response<T> = {
  status: boolean;
  message: string;
  data: T | null;
  errors: object | null;
};

const http = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include", // 允许跨域请求携带 cookie
  timeout: 10000, // 10秒超时
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAuthStore.getState().token;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          const refreshRes = await ky
            .post("/api/auth/refresh", { credentials: "include" })
            .json();
          if ((refreshRes as Response<{ token: string }>).data?.token) {
            useAuthStore.setState({
              token: (refreshRes as Response<{ token: string }>).data?.token,
            });
            return ky(request);
          }
        }
      },
    ],
  },
});

export default http;
