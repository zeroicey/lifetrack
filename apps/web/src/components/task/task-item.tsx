import type { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTaskUpdateMutation } from "@/hooks/use-task-query";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    task: Task;
    isOverlay?: boolean;
}

export default function TaskItem({ task, isOverlay = false }: Props) {
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
                "flex items-center gap-3 mb-2 px-5 py-4 list-none transition-shadow duration-200",
                "bg-white",
                "shadow-sm hover:shadow-md",
                "outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",

                // Style for the original item being dragged (placeholder)
                isDragging && "opacity-50 bg-slate-100",

                // Style for the item in the DragOverlay
                isOverlay && "shadow-xl",

                // Style for completed tasks
                task.status === "done" &&
                    !isDragging &&
                    !isOverlay &&
                    "bg-gray-100"
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

            <div
                {...attributes}
                {...listeners}
                className="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            >
                <GripVertical size={12} />
            </div>
        </div>
    );
}
