import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { isToday } from "date-fns";
import { zhCN } from "date-fns/locale";

interface DaySelectorProps {
    onDaySelected?: (date: Date) => void;
    selectedDate?: Date;
}

export function DaySelector({ onDaySelected, selectedDate }: DaySelectorProps) {
    const [selected, setSelected] = useState<Date | undefined>(selectedDate);
    const [month, setMonth] = useState<Date>(selectedDate || new Date());

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            setSelected(date);
            onDaySelected?.(date);
        }
    };

    return (
        <div className="flex flex-col">
            {/* Calendar component */}
            <div className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={handleSelect}
                    month={month}
                    onMonthChange={setMonth}
                    className="rounded-md border text-sm"
                    locale={zhCN}
                    modifiers={{
                        today: (date) => isToday(date),
                    }}
                    classNames={{
                        caption: "text-sm",
                        nav_button: "h-6 w-6",
                        table: "text-xs",
                        head_cell: "text-xs",
                        cell: "text-xs p-0",
                        day: "h-7 w-7 text-xs",
                    }}
                    showOutsideDays={true}
                    captionLayout="dropdown"
                />
            </div>
        </div>
    );
}

export default DaySelector;
