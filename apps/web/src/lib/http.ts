// lib/http.ts
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
});

export default http;
