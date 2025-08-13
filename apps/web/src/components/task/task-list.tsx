import { useTaskQuery } from "@/hooks/use-task-query";
import TaskItem from "./task-item";
import { useTaskStore } from "@/stores/task";
import { HTTPError } from "ky";

export default function TaskList() {
    const { currentTaskGroup } = useTaskStore();

    const { data: tasks = [], isLoading, error, isError } = useTaskQuery();

    const renderStatusMessage = (message: string, isError = false) => (
        <div className="flex items-center justify-center p-8 w-full h-full">
            <div className={isError ? "text-red-500" : "text-gray-500"}>
                {message}
            </div>
        </div>
    );
    if (isLoading) return renderStatusMessage("Loading tasks...");
    if (isError) {
        if (error instanceof HTTPError && error.response.status === 404) {
            return (
                <div>
                    <h3>分组 "{currentTaskGroup?.name}" 不存在</h3>
                    <p>您想现在创建这个分组吗？</p>
                </div>
            );
        }
        // 处理其他类型的错误
        return <div>加载失败: {error.message}</div>;
    }
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
