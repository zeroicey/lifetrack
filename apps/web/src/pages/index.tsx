import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function IndexPage() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
            <div className="text-center flex gap-2 flex-col">
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
                <p className="text-gray-600">
                    Current API URL: {import.meta.env.VITE_API_URL}
                </p>
                <Button onClick={() => navigate("/login")}>Get Started</Button>
            </div>
        </div>
    );
}
