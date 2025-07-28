import TaskCreateInput from "@/components/task/task-create-input";
import TaskList from "@/components/task/task-list";
import CustomCollapsible from "@/components/task/collapsibles/custom";
import DailyCollapsible from "@/components/task/collapsibles/daily";
import MonthlyCollapsible from "@/components/task/collapsibles/monthly";
import WeeklyCollapsible from "@/components/task/collapsibles/weekly";
import YearlyCollapsible from "@/components/task/collapsibles/yearly";
import { Button } from "@/components/ui/button";
import { useIsPhone } from "@/hooks/use-mobile";
import { useNavbarStore } from "@/stores/navbar";
import { useSettingStore } from "@/stores/setting";
import { useEffect, useState } from "react";

export default function TaskPage() {
    const { setRightContent, clearRightContent } = useNavbarStore();
    const { currentTaskGroupId } = useSettingStore();
    const isMobile = useIsPhone();
    const [isDailyOpen, setIsDailyOpen] = useState(true);
    const [isWeeklyOpen, setIsWeeklyOpen] = useState(false);
    const [isMonthlyOpen, setIsMonthlyOpen] = useState(false);
    const [isYearlyOpen, setIsYearlyOpen] = useState(false);
    const [isCustomOpen, setIsCustomOpen] = useState(false);

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
                <div className="items-center min-w-[150px] border flex-col h-full sm:flex hidden w-[350px] overflow-auto no-scrollbar">
                    <DailyCollapsible
                        isOpen={isDailyOpen}
                        onOpenChange={setIsDailyOpen}
                    />
                    <WeeklyCollapsible
                        isOpen={isWeeklyOpen}
                        onOpenChange={setIsWeeklyOpen}
                    />
                    <MonthlyCollapsible
                        isOpen={isMonthlyOpen}
                        onOpenChange={setIsMonthlyOpen}
                    />
                    <YearlyCollapsible
                        isOpen={isYearlyOpen}
                        onOpenChange={setIsYearlyOpen}
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
