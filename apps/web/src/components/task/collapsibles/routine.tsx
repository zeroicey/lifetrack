import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTaskStore } from "@/stores/task";
import { genNameFromType } from "@/utils/task";
import { Calendar, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import RoutineGroupSelectDialog from "../dialog/routine-select";

interface RoutineCollapsibleProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RoutineCollapsible({
    isOpen,
    onOpenChange,
}: RoutineCollapsibleProps) {
    const { selectedTaskGroupName, setSelectedTaskGroupName } = useTaskStore();
    const [dialogOpen, setDialogOpen] = useState(false);

    const isSelected = (type: "day" | "week" | "month" | "year") => {
        return selectedTaskGroupName === genNameFromType(type);
    };

    const handleCalendarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDialogOpen(true);
    };

    const handleGroupSelected = () => {
        onOpenChange(true);
    };

    return (
        <>
            <Collapsible
                open={isOpen}
                onOpenChange={onOpenChange}
                className="w-full"
            >
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-between p-3 h-auto rounded-none group"
                    >
                        <span className="font-medium">Routine</span>
                        <div className="flex items-center gap-1">
                            <div
                                className={`h-6 w-6 p-0 transition-opacity cursor-pointer hover:bg-accent rounded flex items-center justify-center ${
                                    isOpen
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                }`}
                                onClick={handleCalendarClick}
                            >
                                <Calendar className="h-3 w-3" />
                            </div>
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </div>
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="grid md:grid-cols-2 md:gap-2 p-2 grid-cols-1 gap-4">
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
            <RoutineGroupSelectDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onGroupSelected={handleGroupSelected}
            />
        </>
    );
}
