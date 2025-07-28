import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface WeeklyCollapsibleProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function WeeklyCollapsible({ isOpen, onOpenChange }: WeeklyCollapsibleProps) {
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
                    <span className="font-medium">Weekly</span>
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 px-2 pb-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                >
                    本周任务
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                >
                    周计划
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}
