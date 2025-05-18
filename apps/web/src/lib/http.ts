import { useUserStore } from "@/store/user";
import ky from "ky";

export type Response<T> = {
  status: boolean;
  message: string;
  data: T | null;
  errors: object | null;
};

const http = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  throwHttpErrors: false,
  timeout: 10000,
  hooks: {
    beforeRequest: [
      (request) => {
        if (
          request.url.includes("auth/login") ||
          request.url.includes("auth/register")
        )
          return;

        const token = useUserStore.getState().token;

        if (!token) {
          window.location.href = "/login";
          throw new Error("Unauthorized request: Missing token");
        }

        request.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (response.status === 401) {
          useUserStore.getState().setToken("");
          window.location.href = "/login";
          throw new Error("Unauthorized request: Invalid token");
        }
      },
    ],
  },
});

export default http;
