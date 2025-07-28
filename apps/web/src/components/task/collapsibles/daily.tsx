import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DailyCollapsibleProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DailyCollapsible({
    isOpen,
    onOpenChange,
}: DailyCollapsibleProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

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
            <CollapsibleContent className="space-y-2 px-2 pb-2">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg border"
                />
            </CollapsibleContent>
        </Collapsible>
    );
}
