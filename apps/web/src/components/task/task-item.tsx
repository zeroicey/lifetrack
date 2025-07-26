import type { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTaskUpdateMutation } from "@/hooks/use-task-query";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    task: Task;
}

export default function TaskItem({ task }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const { mutate: updateTask } = useTaskUpdateMutation();

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateTask({
            ...task,
            status: task.status === "done" ? "todo" : "done",
        });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-3 px-3 py-2 mb-2 bg-white border-y border-gray-200 first:border-t-0 last:border-b-0",
                "hover:bg-gray-50",
                isDragging &&
                    "bg-white border-blue-300 shadow-lg z-50 relative",
                task.status === "done" && "opacity-70 bg-gray-50/50"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            >
                <GripVertical size={12} />
            </div>

            <Checkbox
                checked={task.status === "done"}
                className="flex-shrink-0 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                onClick={handleCheckboxClick}
            />

            <span
                className={cn(
                    "flex-1 text-sm font-medium text-gray-700 leading-relaxed select-none",
                    task.status === "done" && "line-through text-gray-400"
                )}
            >
                {task.content}
            </span>
        </div>
    );
}
