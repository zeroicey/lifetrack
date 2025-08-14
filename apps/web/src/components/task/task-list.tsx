import { useTaskQuery } from "@/hooks/use-task-query";
import TaskItem from "./task-item";
import { useTaskStore } from "@/stores/task";
import { useTaskGroupCreateMutation } from "@/hooks/use-task-group-query";
import { Button } from "../ui/button";
import { getTypeFromName } from "@/utils/task";

export default function TaskList() {
    const { selectedTaskGroupName } = useTaskStore();
    const { mutate: createTaskGroup } = useTaskGroupCreateMutation();

    const { data: groups = [], isPending, isError } = useTaskQuery();

    const renderStatusMessage = (message: string, isError = false) => (
        <div className="flex items-center justify-center p-8 w-full h-full">
            <div className={isError ? "text-red-500" : "text-gray-500"}>
                {message}
            </div>
        </div>
    );
    if (isPending) return renderStatusMessage("Loading tasks...");
    if (isError) return renderStatusMessage("loading tasks failed", true);
    // Server Error
    if (!groups) return renderStatusMessage("something went wrong, true");
    // selectedTaskGroupName is not created yet
    if (groups.length !== 1) {
        return (
            <div className="flex items-center justify-center p-8 w-full h-full flex-col">
                <h3>分组 "{selectedTaskGroupName}" 不存在</h3>
                <p>您想现在创建这个分组吗？</p>
                <Button
                    onClick={() =>
                        createTaskGroup({
                            name: selectedTaskGroupName,
                            type: getTypeFromName(selectedTaskGroupName),
                        })
                    }
                >
                    创建分组
                </Button>
            </div>
        );
    }
    if (groups[0].tasks.length === 0)
        return renderStatusMessage("no tasks found");

    return (
        <div className="w-full h-full overflow-auto no-scrollbar">
            {groups[0].tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
}
