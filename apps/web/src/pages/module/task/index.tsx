import TaskCreateInput from "@/components/task/task-create-input";
import TaskList from "@/components/task/task-list";
import CustomCollapsible from "@/components/task/collapsibles/custom";
import { Button } from "@/components/ui/button";
import { useIsPhone } from "@/hooks/use-mobile";
import { useNavbarStore } from "@/stores/navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTaskStore } from "@/stores/task";
import RoutineCollapsible from "@/components/task/collapsibles/routine";

export default function TaskPage() {
    const { setRightContent, clearRightContent } = useNavbarStore();
    const { getCurrentTaskGroupName } = useTaskStore();
    const isMobile = useIsPhone();
    const [isCustomOpen, setIsCustomOpen] = useState(true);
    const [isRoutineOpen, setIsRoutineOpen] = useState(true);

    useEffect(() => {
        setRightContent(
            <Link to={"task/groups"}>
                <Button variant="ghost" className="text-gray-500 text-sm">
                    {getCurrentTaskGroupName()}
                </Button>
            </Link>
        );
        return () => clearRightContent();
    }, [clearRightContent, setRightContent, isMobile, getCurrentTaskGroupName]);

    return (
        <div className="h-full w-full flex justify-center">
            <div className="w-full flex gap-2 p-2">
                <div className="items-center min-w-[270px] border flex-col h-full sm:flex hidden overflow-auto no-scrollbar">
                    <RoutineCollapsible
                        isOpen={isRoutineOpen}
                        onOpenChange={setIsRoutineOpen}
                    />
                    <CustomCollapsible
                        isOpen={isCustomOpen}
                        onOpenChange={setIsCustomOpen}
                    />
                </div>
                <div className="flex border w-full flex-col">
                    <TaskList />
                    <TaskCreateInput />
                </div>
            </div>
        </div>
    );
}
