import type { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import {
    useTaskDeleteMutation,
    useTaskUpdateMutation,
} from "@/hooks/use-task-query";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
    task: Task;
}

// Helper function to convert ISO datetime to datetime-local format for input
import { parseISO, format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

// 将 ISO 时间（带时区）转换成 datetime-local 可用的格式
const formatDateTimeForInput = (
    dateString: string | null | undefined
): string => {
    if (!dateString) return "";
    try {
        const date = parseISO(dateString);
        // 只要 "yyyy-MM-dd'T'HH:mm"，datetime-local 正好能用
        return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch {
        return "";
    }
};

// 将 datetime-local 的值转成 ISO，传给后端
const formatDateTimeForSubmit = (dateString: string): string => {
    if (!dateString) return "";
    return new Date(dateString).toISOString();
};

export default function TaskItem({ task }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [editContent, setEditContent] = useState(task.content);
    const [editDeadline, setEditDeadline] = useState(
        formatDateTimeForInput(task.deadline)
    );

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

            {/* 在大屏幕时显示截止日期 */}
            {task.deadline && (
                <span className="hidden sm:block text-sm text-gray-500 mr-2">
                    {(() => {
                        try {
                            const deadlineDate = parseISO(task.deadline);
                            const now = new Date();
                            const isOverdue = deadlineDate < now;
                            const relativeTime = formatDistanceToNow(
                                deadlineDate,
                                {
                                    addSuffix: true,
                                    locale: zhCN,
                                }
                            );
                            return (
                                <span
                                    className={cn(isOverdue && "text-red-500")}
                                >
                                    {relativeTime}
                                </span>
                            );
                        } catch {
                            return null;
                        }
                    })()}
                </span>
            )}

            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <MoreHorizontal
                        size={20}
                        className="cursor-pointer hover:bg-gray-200 rounded p-1"
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            setEditContent(task.content);
                            setEditDeadline(
                                formatDateTimeForInput(task.deadline)
                            );
                            setUpdateDialogOpen(true);
                            setDropdownOpen(false);
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            setDeleteDialogOpen(true);
                            setDropdownOpen(false);
                        }}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Task</DialogTitle>
                        <DialogDescription>
                            Make changes to your task here. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="content" className="text-right">
                                Content
                            </Label>
                            <Input
                                id="content"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="deadline" className="text-right">
                                Deadline
                            </Label>
                            <Input
                                id="deadline"
                                type="datetime-local"
                                value={editDeadline}
                                onChange={(e) =>
                                    setEditDeadline(e.target.value)
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setUpdateDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            onClick={() => {
                                updateTask({
                                    id: task.id,
                                    content: editContent,
                                    status: task.status,
                                    deadline: editDeadline
                                        ? formatDateTimeForSubmit(editDeadline)
                                        : undefined,
                                });

                                setUpdateDialogOpen(false);
                            }}
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this task? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                deleteTask(task.id);
                                setDeleteDialogOpen(false);
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
