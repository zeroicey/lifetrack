import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface DailyCollapsibleProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DailyCollapsible({
    isOpen,
    onOpenChange,
}: DailyCollapsibleProps) {
    const [dropdown] =
        useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
            "dropdown"
        );
    const [date, setDate] = useState<Date | undefined>(new Date());
    useEffect(() => {
        console.log(format(date || new Date(), "yyyy-MM-dd"));
    }, [date]);

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={onOpenChange}
            className="w-full"
        >
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-between h-auto p-3 rounded-none"
                >
                    <span className="font-medium">Daily</span>
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pb-2 flex justify-center items-center mt-2">
                <Calendar
                    mode="single"
                    defaultMonth={date}
                    selected={date}
                    onSelect={setDate}
                    captionLayout={dropdown}
                    className="rounded-lg border shadow-sm"
                />
            </CollapsibleContent>
        </Collapsible>
    );
}
