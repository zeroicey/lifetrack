import GroupCreateDialog from "@/components/task/group-create-dialog";
import GroupCreateRoutineDialog from "@/components/task/group-create-routine-dialog";
import TaskGroupList from "@/components/task/group-list";
import TaskCreateInput from "@/components/task/task-create-input";
import TaskList from "@/components/task/task-list";
import { Button } from "@/components/ui/button";
import { useIsPhone } from "@/hooks/use-mobile";
import { useNavbarStore } from "@/stores/navbar";
import { useSettingStore } from "@/stores/setting";
import { useEffect } from "react";

export default function TaskPage() {
    const { setRightContent, clearRightContent } = useNavbarStore();
    const { currentTaskGroupId } = useSettingStore();
    const isMobile = useIsPhone();

    useEffect(() => {
        if (isMobile) {
            setRightContent(
                <Button variant="ghost" className="text-gray-500 text-sm">
                    {currentTaskGroupId}
                </Button>
            );
        }
        return () => clearRightContent();
    }, [clearRightContent, setRightContent, isMobile, currentTaskGroupId]);
    return (
        <div className="overflow-auto h-full w-full flex justify-center">
            <div className="w-full flex gap-2 p-2">
                <div className="items-center min-w-[150px] border flex-col h-full sm:flex hidden gap-2">
                    <TaskGroupList />
                    <GroupCreateRoutineDialog />
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
