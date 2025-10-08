import ky from "ky";
import { useUserStore } from "@/stores/user";
import { toast } from "sonner";

export type Response<T> = {
    msg: string;
    data?: T;
};

const backendUrl = import.meta.env.VITE_API_URL;

if (!backendUrl) {
    toast.error(
        "Backend URL not configured. Please set VITE_API_URL environment variable."
    );
    throw new Error(
        "Backend URL not configured. Please set VITE_API_URL environment variable."
    );
}

export const http = ky.extend({
    prefixUrl: backendUrl,
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
