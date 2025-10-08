import ky from "ky";
import { useUserStore } from "@/stores/user";

export type Response<T> = {
    msg: string;
    data?: T;
};

export const http = ky.extend({
    prefixUrl: "api",
    timeout: 10000,
    hooks: {
        beforeRequest: [
            (request) => {
                const token = useUserStore.getState().token;
                if (token) {
                    request.headers.set("Authorization", `Bearer ${token}`);
                }
            },
        ],
        afterResponse: [
            (_request, _options, response) => {
                if (response.status === 401) {
                    window.location.href = "/login";
                    throw new Error("Unauthorized request: not logged in");
                }
            },
        ],
    },
});

export default http;
