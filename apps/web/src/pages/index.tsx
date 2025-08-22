import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function IndexPage() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-2">
            <img src="/logo.png" alt="" className="w-16 h-16" />
            <span>Welcome to lifetrack</span>
            <span>Track your life, help your life and achieve your goals</span>
            <Button onClick={() => navigate("/home")}>Get Started</Button>
        </div>
    );
}
