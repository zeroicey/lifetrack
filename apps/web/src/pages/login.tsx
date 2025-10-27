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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            </div>
            
            {/* Back to Home Button */}
            <div className="absolute top-6 left-6 z-10">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.location.href = '/'}
                    className="flex items-center space-x-2 hover:bg-background/80 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Home</span>
                </Button>
            </div>
            
            <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 animate-in zoom-in duration-500 relative z-10">
                <CardHeader className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                            <img 
                                src="/logo.png" 
                                alt="LifeTrack Logo" 
                                className="h-16 w-16 object-contain relative"
                            />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Sign in to your LifeTrack account
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`pl-10 transition-all duration-300 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-destructive text-xs mt-1 animate-in slide-in-from-top duration-300">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`pl-10 pr-10 transition-all duration-300 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-destructive text-xs mt-1 animate-in slide-in-from-top duration-300">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        
                        <div className="flex items-center text-sm">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input type="checkbox" className="rounded border-input transition-colors duration-200 focus:ring-primary" />
                                <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Remember me</span>
                            </label>
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full font-medium py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                        
                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <a href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline">
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
