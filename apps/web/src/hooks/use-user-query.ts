import { apiUserRegister, apiUserLogin } from "@/api/user";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user";

export const useUserRegisterMutation = () => {
    return useMutation({
        mutationFn: apiUserRegister,
        onSuccess: (data) => {
            toast.success("Registration successful!");
            console.log("Registration successful:", data);
            // Redirect to login or dashboard
            window.location.href = "/login";
        },
        onError: (error) => {
            console.error("Registration failed:", error);
            toast.error("Registration failed. Please try again.");
        },
    });
};

export const useUserLoginMutation = () => {
    const { setUser, setToken } = useUserStore();

    return useMutation({
        mutationFn: apiUserLogin,
        onSuccess: (data) => {
            toast.success("Login successful!");
            console.log("Login successful:", data);

            // Store user data and token
            setUser(data.user);
            setToken(data.token);

            // Redirect to dashboard
            window.location.href = "/";
        },
        onError: (error) => {
            console.error("Login failed:", error);
            toast.error("Login failed. Please check your credentials.");
        },
    });
};
