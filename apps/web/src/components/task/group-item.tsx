import { cn } from "@/lib/utils";
import type { TaskGroup } from "@/types/task";

interface Props {
    group: TaskGroup;
    setCurrentTaskGroup: (taskGroup: TaskGroup) => void;
    currentTaskGroupId: number;
}

export default function TaskGroupItem({
    group,
    setCurrentTaskGroup,
    currentTaskGroupId,
}: Props) {
    return (
        <div
            key={group.id}
            onClick={() => setCurrentTaskGroup(group)}
            className={cn(
                "relative cursor-pointer text-center text-sm p-1 mb-1 border truncate",
                currentTaskGroupId === group.id
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
            )}
        >
            {group.name}
        </div>
    );
}
