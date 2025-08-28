import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { useTaskCreateMutation, useTaskQuery } from "@/hooks/use-task-query";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTaskStore } from "@/stores/task";
import { getTypeFromName } from "@/utils/task";
import { endOfDay, endOfWeek, endOfMonth, endOfYear } from "date-fns";
import { toast } from "sonner";

export default function TaskCreateInput() {
    const { selectedTaskGroupName } = useTaskStore();
    const [taskContent, setTaskContent] = useState("");
    const [deadline, setDeadline] = useState("");

    // Function to calculate default deadline based on group type
    const calculateDefaultDeadline = (groupName: string | null) => {
        if (!groupName) {
            return "";
        }

        const groupType = getTypeFromName(groupName);

        if (groupType === "custom") {
            return ""; // No default value for custom type
        }

        const now = new Date();
        let deadlineDate: Date;

        switch (groupType) {
            case "day": {
                deadlineDate = endOfDay(now);
                break;
            }
            case "week": {
                deadlineDate = endOfWeek(now, { weekStartsOn: 1 }); // Week starts on Monday
                break;
            }
            case "month": {
                deadlineDate = endOfMonth(now);
                break;
            }
            case "year": {
                deadlineDate = endOfYear(now);
                break;
            }
            default:
                return "";
        }

        const offset = deadlineDate.getTimezoneOffset();
        const localTime = new Date(deadlineDate.getTime() - offset * 60 * 1000);
        return localTime.toISOString().slice(0, 16);
    };

    // Update deadline when selectedTaskGroupName changes
    useEffect(() => {
        const newDeadline = calculateDefaultDeadline(selectedTaskGroupName);
        setDeadline(newDeadline);
    }, [selectedTaskGroupName]);
    const [deadlineOpen, setDeadlineOpen] = useState(false);
    const { data: groups = [] } = useTaskQuery();
    const { mutate: createTask } = useTaskCreateMutation();
    const { isPending } = useTaskQuery();

    const handleSubmit = () => {
        if (!groups) return;
        if (groups.length !== 1) return;
        const group_id = groups[0].id;

        // Check if custom type group has deadline set
        const groupType = getTypeFromName(selectedTaskGroupName || "");
        if (groupType === "custom" && !deadline.trim()) {
            toast.error("Custom task groups require a deadline to be set");
            return;
        }

        if (taskContent.trim() && !isPending && deadline.trim()) {
            const isoDeadline = new Date(deadline).toISOString();
            createTask({
                content: taskContent.trim(),
                group_id,
                deadline: isoDeadline,
            });
            setTaskContent("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="flex items-center w-full">
            <input
                value={taskContent}
                onChange={(e) => setTaskContent(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a task..."
                className="w-full rounded-none focus-visible:ring-0 border-t py-1.5 px-3 outline-none"
            />
            <Popover open={deadlineOpen} onOpenChange={setDeadlineOpen}>
                <PopoverTrigger asChild>
                    <Button className="rounded-none h-full">
                        <Calendar className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                                Set Deadline
                                {getTypeFromName(
                                    selectedTaskGroupName || ""
                                ) === "custom" && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {getTypeFromName(
                                    selectedTaskGroupName || ""
                                ) === "custom"
                                    ? "Custom task groups require a deadline to be set"
                                    : "Choose when this task should be completed."}
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                id="deadline"
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <Button
                onClick={handleSubmit}
                disabled={!taskContent.trim()}
                className="rounded-none h-full"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}
