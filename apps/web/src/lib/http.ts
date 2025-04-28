// lib/http.ts
import ky from "ky";

const http = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // 10秒超时
});

export default http;
