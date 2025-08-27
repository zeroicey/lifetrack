import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { type HabitStats } from "@/types/habit";
import { useHabitDeleteMutation } from "@/hooks/use-habit-query";
import { useState } from "react";
import { AddHabitLogDialog } from "./add-habit-log-dialog";

interface HabitItemProps {
    habit: HabitStats;
}

export function HabitItem({ habit }: HabitItemProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteHabitMutation = useHabitDeleteMutation(habit.id);

    const handleDelete = () => {
        deleteHabitMutation.mutate(undefined, {
            onSuccess: () => {
                setDeleteOpen(false);
            },
        });
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">{habit.name}</CardTitle>
                        {habit.description && (
                            <p className="text-sm text-muted-foreground">
                                {habit.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            <Calendar className="h-3 w-3" />
                            {habit.total_logs} logs
                        </Badge>
                        <AddHabitLogDialog habitId={habit.id} />
                        <AlertDialog
                            open={deleteOpen}
                            onOpenChange={setDeleteOpen}
                        >
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Habit
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        habit? This action cannot be undone and
                                        will remove all associated logs.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={deleteHabitMutation.isPending}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {deleteHabitMutation.isPending
                                            ? "Deleting..."
                                            : "Delete"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{habit.total_logs}</div>
                <p className="text-xs text-muted-foreground">Current Streak</p>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        Created{" "}
                        {formatDistanceToNow(new Date(habit.created_at))} ago
                    </div>
                    {habit.last_log_time && (
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" />
                            Last completed{" "}
                            {formatDistanceToNow(
                                new Date(habit.last_log_time)
                            )}{" "}
                            ago
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
