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
                    <div className="p-2 w-full">
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm">
                                Today
                            </Button>
                            <Button variant="outline" size="sm">
                                This Week
                            </Button>
                            <Button variant="outline" size="sm">
                                This Month
                            </Button>
                            <Button variant="outline" size="sm">
                                This Year
                            </Button>
                        </div>
                    </div>
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
