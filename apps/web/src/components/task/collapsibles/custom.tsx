import GroupCreateDialog from "@/components/task/group-create-dialog";
import TaskGroupList from "@/components/task/group-list";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CustomCollapsibleProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CustomCollapsible({ isOpen, onOpenChange }: CustomCollapsibleProps) {
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
                    <span className="font-medium">Custom</span>
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 px-2 pb-2">
                <TaskGroupList />
                <GroupCreateDialog />
            </CollapsibleContent>
        </Collapsible>
    );
}
