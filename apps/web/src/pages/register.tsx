import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
// Removed Checkbox import as it's no longer needed
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Upload } from "lucide-react";
import { useUserRegisterMutation } from "@/hooks/use-user-query";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthday: "",
        avatar: null as File | null,
        bio: "This is this guy's bio"
    });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Removed agreeToTerms state
    const registerMutation = useUserRegisterMutation();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.birthday.trim()) {
            newErrors.birthday = "Birthday is required";
        }

        if (!formData.avatar) {
            newErrors.avatar = "Please upload an avatar";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, avatar: "Please select an image file" }));
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, avatar: "File size must be less than 5MB" }));
                return;
            }
            
            setFormData(prev => ({ ...prev, avatar: file }));
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            
            // Clear error
            if (errors.avatar) {
                setErrors(prev => ({ ...prev, avatar: "" }));
            }
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Remove the data:image/...;base64, prefix
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            let avatarBase64 = "";
            if (formData.avatar) {
                avatarBase64 = await convertFileToBase64(formData.avatar);
            }

            const registerData = {
                name: formData.username,
                email: formData.email,
                password: formData.password,
                birthday: formData.birthday,
                avatar_base64: avatarBase64,
                bio: formData.bio,
            };

            registerMutation.mutate(registerData);
        } catch (error) {
            console.error("Error preparing registration data:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
            
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-3 text-center">
                    <div className="flex items-center justify-center space-x-3">
                        <img
                            src="/logo.png"
                            alt="LifeTrack Logo"
                            className="h-12 w-12"
                        />
                        <CardTitle className="text-2xl font-bold">
                            Create Account
                        </CardTitle>
                    </div>
                    <CardDescription>
                        Join LifeTrack to start organizing your life
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Avatar Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="avatar">Upload Avatar</Label>
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor="avatar-upload"
                                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Choose File
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                </div>
                            </div>
                            {errors.avatar && (
                                <p className="text-sm text-red-500">
                                    {errors.avatar}
                                </p>
                            )}
                        </div>

                        {/* Username Field */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`pl-10 ${
                                        errors.username ? "border-red-500" : ""
                                    }`}
                                    required
                                />
                            </div>
                            {errors.username && (
                                <p className="text-sm text-red-500">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`pl-10 ${
                                        errors.email ? "border-red-500" : ""
                                    }`}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`pl-10 pr-10 ${
                                        errors.password ? "border-red-500" : ""
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`pl-10 pr-10 ${
                                        errors.confirmPassword
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Birthday Field */}
                        <div className="space-y-2">
                            <Label htmlFor="birthday">Birthday</Label>
                            <Input
                                id="birthday"
                                name="birthday"
                                type="date"
                                value={formData.birthday}
                                onChange={handleInputChange}
                                className={errors.birthday ? "border-red-500" : ""}
                                required
                            />
                            {errors.birthday && (
                                <p className="text-sm text-red-500">
                                    {errors.birthday}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        {/* Login Link */}
                        <div className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Sign in
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
