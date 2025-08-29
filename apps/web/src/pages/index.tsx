import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/user";
import { toast } from "sonner";
import { useValidateBackendUrl } from "@/hooks/use-health-query";

export default function IndexPage() {
    const navigate = useNavigate();
    const { backendUrl, setBackendUrl } = useUserStore();
    const [inputUrl, setInputUrl] = useState("");
    const [isValidUrl, setIsValidUrl] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [validationUrl, setValidationUrl] = useState<string | null>(null);

    // 验证后端URL的查询
    const {
        data: healthData,
        error: healthError,
        isLoading: isHealthLoading,
    } = useValidateBackendUrl(validationUrl);

    useEffect(() => {
        if (backendUrl) {
            setInputUrl(backendUrl);
            setIsValidUrl(true);
        }
    }, [backendUrl]);

    // 处理健康检查结果
    useEffect(() => {
        if (validationUrl && !isHealthLoading) {
            setIsValidating(false);
            if (healthData?.data?.status === "ok") {
                setBackendUrl(validationUrl);
                toast.success("Backend URL validated and saved successfully!");
            } else if (healthError) {
                toast.error(`Backend URL validation failed: ${healthError.message}`);
            }
            setValidationUrl(null);
        }
    }, [
        healthData,
        healthError,
        isHealthLoading,
        validationUrl,
        setBackendUrl,
    ]);

    const validateUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleUrlChange = (value: string) => {
        setInputUrl(value);
        setIsValidUrl(validateUrl(value));
    };

    const handleSaveUrl = async () => {
        if (!isValidUrl || !inputUrl) {
            toast.error("请输入有效的URL");
            return;
        }

        setIsValidating(true);
        // 临时设置后端URL以便进行健康检查
        const originalBackendUrl = backendUrl;
        setBackendUrl(inputUrl);

        try {
            // 触发健康检查验证
            setValidationUrl(inputUrl);
        } catch {
            // 如果出错，恢复原来的URL
            setBackendUrl(originalBackendUrl);
            setIsValidating(false);
            toast.error("验证过程中出现错误");
        }
    };

    const handleGetStarted = () => {
        if (!backendUrl) {
            toast.error("Please configure backend URL first");
            return;
        }
        navigate("/home");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
            <div className="text-center">
                <img
                    src="/logo.png"
                    alt="LifeTrack Logo"
                    className="w-16 h-16 mx-auto mb-4"
                />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome to LifeTrack
                </h1>
                <p className="text-gray-600">
                    Track your life, help your life and achieve your goals
                </p>
            </div>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl">
                        Backend Configuration
                    </CardTitle>
                    <CardDescription>
                        Enter your backend server URL to get started
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="backend-url">Backend Server URL</Label>
                        <Input
                            id="backend-url"
                            type="url"
                            placeholder="https://your-backend-server.com/api"
                            value={inputUrl}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            className={
                                inputUrl && !isValidUrl ? "border-red-500" : ""
                            }
                        />
                        {inputUrl && !isValidUrl && (
                            <p className="text-red-500 text-xs">
                                Please enter a valid URL
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleSaveUrl}
                            disabled={!isValidUrl || !inputUrl || isValidating}
                            variant="outline"
                            className="flex-1"
                        >
                            {isValidating ? "Validating..." : "Save URL"}
                        </Button>
                        <Button
                            onClick={handleGetStarted}
                            disabled={!backendUrl}
                            className="flex-1"
                        >
                            Get Started
                        </Button>
                    </div>

                    {backendUrl && (
                        <div className="text-center text-sm text-green-600">
                            ✓ Backend URL configured: {backendUrl}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
