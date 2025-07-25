import GroupCreateDialog from "@/components/task/group-create-dialog";
import TaskGroupList from "@/components/task/group-list";
import TaskCreateInput from "@/components/task/task-create-input";
import TaskList from "@/components/task/task-list";

export default function TaskPage() {
    return (
        <div className="overflow-auto h-full w-full flex justify-center">
            <div className="w-full flex gap-2 p-2">
                <div className="flex items-center min-w-[150px] border flex-col h-full">
                    <TaskGroupList />
                    <GroupCreateDialog />
                </div>
                <div className="flex border w-full flex-col">
                    <TaskList />
                    <TaskCreateInput />
                </div>
            </div>
        </div>
    );
}
