import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    format,
    getWeek,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameWeek,
    isSameMonth,
    addMonths,
    subMonths,
    startOfDay,
    isSameDay,
} from "date-fns";
import { zhCN } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface WeekSelectorProps {
    onWeekSelected?: (
        weekStart: Date,
        weekEnd: Date,
        weekNumber: number
    ) => void;
    selectedWeek?: { start: Date; end: Date; number: number };
}

export function WeekSelector({
    onWeekSelected,
    selectedWeek,
}: WeekSelectorProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [localSelectedWeekStart, setLocalSelectedWeekStart] =
        useState<Date | null>(selectedWeek ? selectedWeek.start : null);

    const today = startOfDay(new Date());
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });

    const handleWeekSelect = (day: Date) => {
        const weekStart = startOfWeek(day, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(day, { weekStartsOn: 1 });
        const weekNumber = getWeek(day, { weekStartsOn: 1 });

        setLocalSelectedWeekStart(weekStart);
        onWeekSelected?.(weekStart, weekEnd, weekNumber);
    };

    const handleMonthChange = (direction: "prev" | "next") => {
        setCurrentDate((prev) =>
            direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1)
        );
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    // Group dates by week
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7));
    }

    return (
        <div className="space-y-3">
            {/* Month navigation */}
            <div className="flex items-center justify-center mb-2 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMonthChange("prev")}
                    className="h-7 w-7 p-0"
                >
                    <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium">
                    {format(currentDate, "yyyy-MM", { locale: zhCN })}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMonthChange("next")}
                    className="h-7 w-7 p-0"
                >
                    <ChevronRight className="h-3 w-3" />
                </Button>
            </div>

            {/* Week headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, index) => (
                        <div
                            key={index}
                            className="h-6 flex items-center justify-center text-xs font-medium text-muted-foreground"
                        >
                            {day}
                        </div>
                    )
                )}
            </div>

            {/* Week selector */}
            <div className="space-y-1">
                {weeks.map((week, weekIndex) => {
                    const isSelectedWeek =
                        localSelectedWeekStart &&
                        isSameWeek(week[0], localSelectedWeekStart, {
                            weekStartsOn: 1,
                        });
                    const isCurrentWeekRow = isSameWeek(
                        week[0],
                        currentWeekStart,
                        { weekStartsOn: 1 }
                    );

                    return (
                        <div
                            key={weekIndex}
                            className={cn(
                                "grid grid-cols-7 gap-1 rounded-md transition-all duration-200 cursor-pointer hover:bg-accent/50 p-1",
                                isSelectedWeek &&
                                    "bg-blue-100 ring-1 ring-blue-300",
                                isCurrentWeekRow &&
                                    !isSelectedWeek &&
                                    "bg-orange-100 ring-1 ring-orange-300"
                            )}
                            onClick={() => handleWeekSelect(week[0])}
                            title={`Select week ${getWeek(week[0], {
                                weekStartsOn: 1,
                            })} (${format(week[0], "MM/dd", {
                                locale: zhCN,
                            })} - ${format(week[6], "MM/dd", {
                                locale: zhCN,
                            })})`}
                        >
                            {week.map((day, dayIndex) => {
                                const isToday = isSameDay(day, today);
                                const isCurrentMonth = isSameMonth(
                                    day,
                                    currentDate
                                );

                                return (
                                    <div
                                        key={dayIndex}
                                        className={cn(
                                            "h-6 flex items-center justify-center text-xs rounded transition-colors",
                                            !isCurrentMonth &&
                                                "text-muted-foreground/40",
                                            isCurrentMonth && "text-foreground",
                                            isToday &&
                                                "bg-orange-200 text-orange-800 font-semibold",
                                            isSelectedWeek &&
                                                !isToday &&
                                                "text-blue-700 font-medium"
                                        )}
                                    >
                                        {format(day, "d")}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default WeekSelector;
