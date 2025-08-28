import type { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import {
    useTaskDeleteMutation,
    useTaskUpdateMutation,
} from "@/hooks/use-task-query";
import { CalendarDays, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
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

interface Props {
    task: Task;
}

export default function TaskItem({ task }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
                "flex items-center gap-3 mb-2 px-5 py-4 list-none",
                "bg-gray-50",
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

            <CalendarDays size={16} className="cursor-pointer" />
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Trash2
                        size={16}
                        className="cursor-pointer"
                    />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除任务</AlertDialogTitle>
                        <AlertDialogDescription>
                            您确定要删除这个任务吗？此操作无法撤销。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                deleteTask(task.id);
                                setDeleteDialogOpen(false);
                            }}
                        >
                            删除
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
