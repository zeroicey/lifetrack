import { useTaskQuery } from "@/hooks/use-task-query";
import TaskItem from "./task-item";
import { useSettingStore } from "@/stores/setting";

export default function TaskList() {
    const { currentTaskGroupId } = useSettingStore();

    const { data: tasks = [], isLoading, error } = useTaskQuery();

    const renderStatusMessage = (message: string, isError = false) => (
        <div className="flex items-center justify-center p-8 w-full h-full">
            <div className={isError ? "text-red-500" : "text-gray-500"}>
                {message}
            </div>
        </div>
    );
    if (currentTaskGroupId === -1)
        return renderStatusMessage("No task group created yet");
    if (isLoading) return renderStatusMessage("Loading tasks...");
    if (error) return renderStatusMessage("Error loading tasks", true);
    if (!tasks || tasks.length === 0)
        return renderStatusMessage("No tasks found");

    return (
        <div className="w-full h-full overflow-auto no-scrollbar">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
}
