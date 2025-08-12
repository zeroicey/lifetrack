import TaskCreateInput from "@/components/task/task-create-input";
import TaskList from "@/components/task/task-list";
import CustomCollapsible from "@/components/task/collapsibles/custom";
import { Button } from "@/components/ui/button";
import { useIsPhone } from "@/hooks/use-mobile";
import { useNavbarStore } from "@/stores/navbar";
import { useSettingStore } from "@/stores/setting";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function TaskPage() {
    const { setRightContent, clearRightContent } = useNavbarStore();
    const { currentTaskGroup } = useSettingStore();
    const isMobile = useIsPhone();
    const [isCustomOpen, setIsCustomOpen] = useState(true);

    useEffect(() => {
        setRightContent(
            <Link to={"task/groups"}>
                <Button variant="ghost" className="text-gray-500 text-sm">
                    {currentTaskGroup.name}
                </Button>
            </Link>
        );
        return () => clearRightContent();
    }, [clearRightContent, setRightContent, isMobile, currentTaskGroup]);

    return (
        <div className="h-full w-full flex justify-center">
            <div className="w-full flex gap-2 p-2">
                <div className="items-center min-w-[270px] border flex-col h-full sm:flex hidden overflow-auto no-scrollbar">
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
