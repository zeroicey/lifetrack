import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHabitQuery } from "@/hooks/use-habit-query";
import { useNavigate } from "react-router";
import { Plus, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function HabitPage() {
    const navigate = useNavigate();
    const { data: habits = [], isLoading } = useHabitQuery();

    if (isLoading) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <div>Loading habits...</div>
            </div>
        );
    }

    return (
        <div className="overflow-auto h-full w-full flex justify-center p-4">
            <div className="max-w-[800px]">
                {/* Habits List */}
                {habits.length === 0 ? (
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
                ) : (
                    <div className="grid gap-4">
                        {habits.map((habit) => (
                            <Card
                                key={habit.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">
                                                {habit.name}
                                            </CardTitle>
                                            {habit.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {habit.description}
                                                </p>
                                            )}
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            <Calendar className="h-3 w-3" />
                                            {habit.total_logs} logs
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Created{" "}
                                            {formatDistanceToNow(
                                                new Date(habit.created_at),
                                                { addSuffix: true }
                                            )}
                                        </div>
                                        {habit.last_log_time && (
                                            <div className="flex items-center gap-1">
                                                <span>
                                                    Last logged{" "}
                                                    {formatDistanceToNow(
                                                        new Date(
                                                            habit.last_log_time
                                                        ),
                                                        { addSuffix: true }
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
