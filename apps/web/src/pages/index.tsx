import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { ArrowRight, Target, Calendar, TrendingUp } from "lucide-react";

export default function IndexPage() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-12 p-4 bg-gradient-to-br from-primary/5 via-background to-accent/10">
            <div className="text-center flex gap-6 flex-col max-w-2xl animate-in fade-in duration-1000">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                        <img
                            src="/logo.png"
                            alt="LifeTrack Logo"
                            className="w-24 h-24 mx-auto relative animate-in zoom-in duration-700"
                        />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2 animate-in slide-in-from-bottom duration-700">
                        Welcome to LifeTrack
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-md animate-in slide-in-from-bottom duration-700 delay-150">
                        Track your life, help your life and achieve your goals with our comprehensive life management platform
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 animate-in slide-in-from-bottom duration-700 delay-300">
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Target className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-sm">Goal Tracking</h3>
                        <p className="text-xs text-muted-foreground text-center">Set and achieve your life goals</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-sm">Event Planning</h3>
                        <p className="text-xs text-muted-foreground text-center">Organize your schedule efficiently</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="p-3 rounded-full bg-primary/10">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-sm">Progress Insights</h3>
                        <p className="text-xs text-muted-foreground text-center">Track your growth over time</p>
                    </div>
                </div>

                <div className="flex gap-4 justify-center animate-in slide-in-from-bottom duration-700 delay-500">
                    <Button 
                        onClick={() => navigate("/login")}
                        size="lg"
                        className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button 
                        onClick={() => navigate("/register")}
                        variant="outline"
                        size="lg"
                        className="gap-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </div>
    );
}
