import ky from "ky";

export type Response<T> = {
    code: number;
    msg: string;
    data: T | null;
};

const http = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    throwHttpErrors: false,
    timeout: 10000,
});

export default http;
