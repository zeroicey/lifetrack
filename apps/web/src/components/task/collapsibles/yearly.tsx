import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface YearlyCollapsibleProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function YearlyCollapsible({
    isOpen,
    onOpenChange,
}: YearlyCollapsibleProps) {
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
                    <span className="font-medium">Yearly</span>
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 px-2 pb-2 mt-2">
                <Button variant="outline" size="sm" className="w-full">
                    年度目标
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                    年度总结
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}
