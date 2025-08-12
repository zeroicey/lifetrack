import type { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import {
    useTaskDeleteMutation,
    useTaskUpdateMutation,
} from "@/hooks/use-task-query";
import { CalendarDays, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    task: Task;
}

export default function TaskItem({ task }: Props) {

    const { mutate: updateTask } = useTaskUpdateMutation();
    const { mutate: deleteTask } = useTaskDeleteMutation();

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateTask({
            ...task,
            status: task.status === "done" ? "todo" : "done",
        });
    };

    return (
        <div
            className={cn(
                "flex items-center gap-3 mb-2 px-5 py-4 list-none transition-shadow duration-200",
                "bg-white",
                "shadow-sm hover:shadow-md",
                "outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
                task.status === "done" && "bg-gray-100"
            )}
        >
            <Checkbox
                checked={task.status === "done"}
                className="flex-shrink-0 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                onClick={handleCheckboxClick}
            />

            <span
                className={cn(
                    "flex-1 select-none",
                    "text-gray-800 font-normal text-base", // from .Item text styles
            task.status === "done" && "line-through text-gray-400" // from .disabled and original
                )}
            >
                {task.content}
            </span>

            <CalendarDays size={12} className="cursor-pointer" />
        <Trash2 size={12} className="cursor-pointer" onClick={() => deleteTask(task.id)} />
        </div>
    );
}
