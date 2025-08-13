import { useTaskQuery } from "@/hooks/use-task-query";
import TaskItem from "./task-item";
import { useTaskStore } from "@/stores/task";
import { HTTPError } from "ky";
import { useTaskGroupCreateMutation } from "@/hooks/use-task-group-query";
import { Button } from "../ui/button";

export default function TaskList() {
    const { currentTaskGroup, getCurrentTaskGroupName } = useTaskStore();
    const { mutate: createTaskGroup } = useTaskGroupCreateMutation();

    const { data: tasks = [], isLoading, error, isError } = useTaskQuery();

    const renderStatusMessage = (message: string, isError = false) => (
        <div className="flex items-center justify-center p-8 w-full h-full">
            <div className={isError ? "text-red-500" : "text-gray-500"}>
                {message}
            </div>
        </div>
    );
    if (isError) {
        if (error instanceof HTTPError && error.response.status === 404) {
            return (
                <div className="flex items-center justify-center p-8 w-full h-full flex-col">
                    <h3>分组 "{getCurrentTaskGroupName()}" 不存在</h3>
                    <p>您想现在创建这个分组吗？</p>
                    <Button
                        onClick={() =>
                            createTaskGroup({
                                name: getCurrentTaskGroupName(),
                                type: currentTaskGroup?.type || "day",
                            })
                        }
                    >
                        创建分组
                    </Button>
                </div>
            );
        }
        return <div>加载失败: {error.message}</div>;
    }
    if (isLoading) return renderStatusMessage("Loading tasks...");
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
