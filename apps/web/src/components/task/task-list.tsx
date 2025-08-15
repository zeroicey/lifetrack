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
            <div className="flex items-center justify-center p-12 w-full h-full flex-col space-y-6">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Group "{selectedTaskGroupName}" does not exist
                        </h3>
                        <p className="text-gray-600 max-w-md">
                            This group hasn't been created yet. Would you like to create it now to start organizing your tasks?
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() =>
                        createTaskGroup({
                            name: selectedTaskGroupName,
                            type: getTypeFromName(selectedTaskGroupName),
                        })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Group
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
