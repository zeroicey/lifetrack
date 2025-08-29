import ky, { type Options } from "ky";
import { useUserStore } from "@/stores/user";
import { toast } from "sonner";

export type Response<T> = {
    msg: string;
    data?: T;
};

const createHttpInstance = (options?: Options) => {
    const backendUrl = useUserStore.getState().backendUrl;
    if (!backendUrl) {
        toast.error(
            "Backend URL not configured. Please configure it on the home page."
        );
        throw new Error(
            "Backend URL not configured. Please configure it on the home page."
        );
    }

    return ky.extend({
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
        ...options,
    });
};

const http: typeof ky = new Proxy(ky, {
    get(_, prop) {
        const instance = createHttpInstance();
        const value = instance[prop as keyof typeof instance];
        return typeof value === "function" ? value.bind(instance) : value;
    },
});

export default http;
