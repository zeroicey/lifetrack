import { useTasksQuery } from "@/hooks/use-task-query";
import { type Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";

export default function TaskList() {
    const { data: tasks, isLoading, error } = useTasksQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 w-full h-full">
                <div className="text-gray-500">Loading tasks...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 w-full h-full">
                <div className="text-red-500">Error loading tasks</div>
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 w-full h-full">
                <div className="text-gray-500">No tasks found</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            {tasks.map((task: Task) => (
                <div
                    key={task.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                >
                    <Checkbox
                        checked={task.status === "done"}
                        className="flex-shrink-0"
                    />
                    <span
                        className={`text-sm ${
                            task.status === "done"
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                        }`}
                    >
                        {task.content}
                    </span>
                </div>
            ))}
        </div>
    );
}
