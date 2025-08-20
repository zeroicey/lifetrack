import TaskCreateInput from "@/components/task/task-create-input";
import TaskList from "@/components/task/task-list";
import CustomCollapsible from "@/components/task/collapsibles/custom";
import RoutineCollapsible from "@/components/task/collapsibles/routine";
import { useState } from "react";

export default function TaskPage() {
    const [isCustomOpen, setIsCustomOpen] = useState(true);
    const [isRoutineOpen, setIsRoutineOpen] = useState(true);

    return (
        <div className="h-full w-full flex justify-center">
            <div className="w-full flex gap-2 p-2">
                <div className="items-center border flex-col h-full sm:flex hidden overflow-auto no-scrollbar max-w-[170px] w-full md:max-w-[250px] transition-all duration-300 ease-in-out">
                    <RoutineCollapsible
                        isOpen={isRoutineOpen}
                        onOpenChange={setIsRoutineOpen}
                    />
                    <CustomCollapsible
                        isOpen={isCustomOpen}
                        onOpenChange={setIsCustomOpen}
                    />
                </div>
                <div className="flex border w-full flex-col">
                    <TaskList />
                    <TaskCreateInput />
                </div>
            </div>
        </div>
    );
}
