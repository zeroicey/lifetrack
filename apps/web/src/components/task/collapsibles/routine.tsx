import { apiGetTaskGroupByNameWithTasks } from "@/api/task";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTaskStore } from "@/stores/task";
import { format } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface RoutineCollapsibleProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RoutineCollapsible({
    isOpen,
    onOpenChange,
}: RoutineCollapsibleProps) {
    const { setCurrentTaskGroup, currentTaskGroup } = useTaskStore();
    useEffect(() => {
        if (currentTaskGroup) return;
        const loadDefaultGroup = async () => {
            const data = await apiGetTaskGroupByNameWithTasks(
                format(new Date(), "yyyy-MM-dd")
            );
            setCurrentTaskGroup(data);
        };
        loadDefaultGroup();
        return () => {
            setCurrentTaskGroup(null);
        };
    }, []);
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
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setCurrentTaskGroup({
                            id: -1,
                            name: format(new Date(), "yyyy-MM-dd"),
                            description: "",
                            created_at: "",
                            type: "day",
                            updated_at: "",
                        })
                    }
                >
                    Today
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setCurrentTaskGroup({
                            id: -1,
                            name: format(new Date(), "yyyy-'W'ww"),
                            description: "",
                            created_at: "",
                            type: "week",
                            updated_at: "",
                        })
                    }
                >
                    This Week
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setCurrentTaskGroup({
                            id: -1,
                            name: format(new Date(), "yyyy-'MM'"),
                            description: "",
                            created_at: "",
                            type: "month",
                            updated_at: "",
                        })
                    }
                >
                    This Month
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setCurrentTaskGroup({
                            id: -1,
                            name: format(new Date(), "yyyy"),
                            description: "",
                            created_at: "",
                            type: "year",
                            updated_at: "",
                        })
                    }
                >
                    This Year
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}
