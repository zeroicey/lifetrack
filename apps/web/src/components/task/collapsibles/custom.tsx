import GroupCreateDialog from "@/components/task/group-create-dialog";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import CustomTaskGroupList from "../custom-group-list";

interface CustomCollapsibleProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CustomCollapsible({
    isOpen,
    onOpenChange,
}: CustomCollapsibleProps) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDialogOpen(true);
    };

    const handleGroupCreated = () => {
        // 确保折叠栏展开
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
                        <span className="font-medium">Custom</span>
                        <div className="flex items-center gap-1">
                            <div
                                className={`h-6 w-6 p-0 transition-opacity cursor-pointer hover:bg-accent rounded flex items-center justify-center ${
                                    isOpen
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                }`}
                                onClick={handleAddClick}
                            >
                                <Plus className="h-3 w-3" />
                            </div>
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </div>
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 px-2 pb-2 mt-2">
                    <CustomTaskGroupList />
                </CollapsibleContent>
            </Collapsible>
            <GroupCreateDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onGroupCreated={handleGroupCreated}
            />
        </>
    );
}
