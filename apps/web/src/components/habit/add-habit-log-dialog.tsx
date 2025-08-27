import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useHabitLogCreateMutation } from "@/hooks/use-habit-query";
import { useState } from "react";

interface AddHabitLogDialogProps {
    habitId: number;
}

export function AddHabitLogDialog({ habitId }: AddHabitLogDialogProps) {
    const [open, setOpen] = useState(false);
    const [happenedAt, setHappenedAt] = useState(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localTime = new Date(now.getTime() - offset * 60 * 1000);
        return localTime.toISOString().slice(0, 16);
    });

    const createHabitLogMutation = useHabitLogCreateMutation();

    const handleAddLog = () => {
        const isoString = new Date(happenedAt).toISOString();
        createHabitLogMutation.mutate(
            {
                habit_id: habitId,
                happened_at: isoString,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    // Reset to current time
                    const now = new Date();
                    const offset = now.getTimezoneOffset();
                    const localTime = new Date(
                        now.getTime() - offset * 60 * 1000
                    );
                    setHappenedAt(localTime.toISOString().slice(0, 16));
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Habit Log</DialogTitle>
                    <DialogDescription>
                        Record when you completed this habit.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="happened-at" className="text-right">
                            Time
                        </Label>
                        <Input
                            id="happened-at"
                            type="datetime-local"
                            value={happenedAt}
                            onChange={(e) => setHappenedAt(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleAddLog}
                        disabled={createHabitLogMutation.isPending}
                    >
                        {createHabitLogMutation.isPending
                            ? "Adding..."
                            : "Add Log"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
