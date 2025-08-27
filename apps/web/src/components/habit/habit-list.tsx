import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { Plus, Calendar } from "lucide-react";
import { HabitItem } from "@/components/habit/habit-item";
import { type HabitStats } from "@/types/habit";

interface HabitListProps {
    habits: HabitStats[];
    isLoading: boolean;
}

export function HabitList({ habits, isLoading }: HabitListProps) {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <div>Loading habits...</div>
            </div>
        );
    }

    if (habits.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        No habits yet
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                        Start building better habits by creating your
                        first one.
                    </p>
                    <Button onClick={() => navigate("/habit/create")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Habit
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {habits.map((habit) => (
                            <HabitItem 
                                key={habit.id} 
                                habit={habit} 
                            />
                        ))}
        </div>
    );
}