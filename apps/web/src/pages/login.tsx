import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useUserLoginMutation } from "@/hooks/use-user-query";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const loginMutation = useUserLoginMutation();

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        loginMutation.mutate({ email, password });
    };

    const handleInputChange = (field: string, value: string) => {
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            {/* Back to Home Button */}
            <div className="absolute top-6 left-6">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.location.href = '/'}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Home</span>
                </Button>
            </div>
            
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <img 
                            src="/logo.png" 
                            alt="LifeTrack Logo" 
                            className="h-16 w-16 object-contain"
                        />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Sign in to your LifeTrack account
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        
                        <div className="flex items-center text-sm">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300" />
                                <span className="text-gray-600">Remember me</span>
                            </label>
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                        
                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
