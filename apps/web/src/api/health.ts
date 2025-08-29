import type { Response } from "@/lib/http";
import http from "@/lib/http";

export interface HealthCheckResponse {
    status: string;
    timestamp: number;
    service: string;
    database: string;
}

/**
 * 检查后端服务健康状态
 * @returns Promise<Response<HealthCheckResponse>>
 */
export const apiHealthCheck = async (): Promise<Response<HealthCheckResponse>> => {
    const res = await http.get("health").json<Response<HealthCheckResponse>>();
    return res;
};