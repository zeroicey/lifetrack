import CustomCollapsible from "@/components/task/collapsibles/custom";
import RoutineCollapsible from "@/components/task/collapsibles/routine";
import { useState } from "react";

export default function TaskGroupPage() {
    const [isCustomOpen, setIsCustomOpen] = useState(true);
    const [isRoutineOpen, setIsRoutineOpen] = useState(true);
    return (
        <div className="items-center border flex-col h-full flex overflow-auto no-scrollbar">
            <RoutineCollapsible
                isOpen={isRoutineOpen}
                onOpenChange={setIsRoutineOpen}
            />
            <CustomCollapsible
                isOpen={isCustomOpen}
                onOpenChange={setIsCustomOpen}
            />
        </div>
    );
}
