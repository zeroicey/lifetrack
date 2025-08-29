import { useQuery } from "@tanstack/react-query";
import { apiHealthCheck } from "@/api/health";

/**
 * 健康检查查询hook
 * @param enabled 是否启用查询
 * @returns 健康检查查询结果
 */
export const useHealthCheckQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["health"],
        queryFn: apiHealthCheck,
        enabled,
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 30000, // 30秒内不重新请求
    });
};

/**
 * 用于验证后端URL是否可用的hook
 * @param backendUrl 后端URL
 * @returns 验证查询结果
 */
export const useValidateBackendUrl = (backendUrl: string | null) => {
    return useQuery({
        queryKey: ["validate-backend", backendUrl],
        queryFn: apiHealthCheck,
        enabled: !!backendUrl,
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 0, // 每次都重新验证
    });
};