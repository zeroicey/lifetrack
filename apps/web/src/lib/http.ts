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
  timeout: 10000, // 10秒超时
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAuthStore.getState().access_token;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          const refreshRes: Response<{
            access_token: string;
            refresh_token: string;
          }> = await ky
            .post("http://localhost:5000/api/auth/refresh-token", {
              json: {
                refresh_token: useAuthStore.getState().refresh_token,
              },
            })
            .json();
          if (refreshRes.status) {
            useAuthStore
              .getState()
              .setAccessToken(refreshRes.data?.access_token!);
            useAuthStore
              .getState()
              .setRefreshToken(refreshRes.data?.refresh_token!);
            return ky(request, options);
          }
        }
      },
    ],
  },
});

export default http;
