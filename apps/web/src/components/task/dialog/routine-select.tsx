import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import YearSelector from "../routine-selectors/year";
import MonthSelector from "../routine-selectors/month";
import DaySelector from "../routine-selectors/day";
import WeekSelector from "../routine-selectors/week";
import { useTaskStore } from "@/stores/task";

interface RoutineGroupSelectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGroupSelected?: () => void;
}

export default function RoutineGroupSelectDialog({
    open,
    onOpenChange,
    onGroupSelected,
}: RoutineGroupSelectDialogProps) {
    const [activeTab, setActiveTab] = useState<
        "Day" | "Week" | "Month" | "Year"
    >("Day");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [, setSelectedMonth] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const { setSelectedTaskGroupName } = useTaskStore();
    const [selectedWeek, setSelectedWeek] = useState<{
        start: Date;
        end: Date;
        number: number;
    } | null>(null);
    const [currentGroup, setCurrentGroup] = useState<string>("");

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleSelect = () => {
        setSelectedTaskGroupName(currentGroup);
        handleClose();
        onGroupSelected?.();
    };

    const tabs = ["Day", "Week", "Month", "Year"] as const;

    const handleYearSelected = (year: string) => {
        setSelectedYear(year);
        setCurrentGroup(year);
        // Clear other selector states
        setSelectedMonth("");
        setSelectedDay(null);
        setSelectedWeek(null);
    };

    const handleMonthSelected = (month: string) => {
        setSelectedMonth(month);
        setCurrentGroup(month);
        // Clear other selector states
        setSelectedYear("");
        setSelectedDay(null);
        setSelectedWeek(null);
    };

    const handleDaySelected = (date: Date) => {
        setSelectedDay(date);
        const dayGroup = format(date, "yyyy-MM-dd");
        setCurrentGroup(dayGroup);
        // Clear other selector states
        setSelectedYear("");
        setSelectedMonth("");
        setSelectedWeek(null);
    };

    const handleWeekSelected = (
        weekStart: Date,
        weekEnd: Date,
        weekNumber: number
    ) => {
        setSelectedWeek({ start: weekStart, end: weekEnd, number: weekNumber });
        const year = format(weekStart, "yyyy");
        const weekGroup = `${year}-W${weekNumber.toString().padStart(2, "0")}`;
        setCurrentGroup(weekGroup);
        // Clear other selector states
        setSelectedYear("");
        setSelectedMonth("");
        setSelectedDay(null);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "Day":
                return (
                    <DaySelector
                        onDaySelected={handleDaySelected}
                        selectedDate={selectedDay || undefined}
                    />
                );
            case "Week":
                return (
                    <WeekSelector
                        onWeekSelected={handleWeekSelected}
                        selectedWeek={selectedWeek || undefined}
                    />
                );
            case "Month":
                return <MonthSelector onMonthSelected={handleMonthSelected} />;
            case "Year":
                return (
                    <YearSelector
                        onYearSelected={handleYearSelected}
                        selectedYear={selectedYear}
                    />
                );
            default:
                return (
                    <div className="text-center text-gray-500">
                        Content will be implemented later
                    </div>
                );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Select Routine Group
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Select a routine group for your tasks.
                    </DialogDescription>
                    {currentGroup && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                            <span className="text-sm font-medium text-blue-800">
                                Currently selected: {currentGroup}
                            </span>
                        </div>
                    )}
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="py-2">{renderTabContent()}</div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSelect}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Select
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
