import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTaskStore } from "@/stores/task";
import { genNameFromType } from "@/utils/task";
import { ChevronDown, ChevronRight } from "lucide-react";

interface RoutineCollapsibleProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RoutineCollapsible({
    isOpen,
    onOpenChange,
}: RoutineCollapsibleProps) {
    const { selectedTaskGroupName, setSelectedTaskGroupName } = useTaskStore();
    
    const isSelected = (type: "day" | "week" | "month" | "year") => {
        return selectedTaskGroupName === genNameFromType(type);
    };
    
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={onOpenChange}
            className="w-full"
        >
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto rounded-none"
                >
                    <span className="font-medium">Routine</span>
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="grid grid-cols-2 gap-2 p-2">
                <Button
                    size="sm"
                    variant={isSelected("day") ? "default" : "outline"}
                    onClick={() =>
                        setSelectedTaskGroupName(genNameFromType("day"))
                    }
                >
                    Today
                </Button>
                <Button
                    variant={isSelected("week") ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                        setSelectedTaskGroupName(genNameFromType("week"))
                    }
                >
                    This Week
                </Button>
                <Button
                    variant={isSelected("month") ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                        setSelectedTaskGroupName(genNameFromType("month"))
                    }
                >
                    This Month
                </Button>
                <Button
                    variant={isSelected("year") ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                        setSelectedTaskGroupName(genNameFromType("year"))
                    }
                >
                    This Year
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}
