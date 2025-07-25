import { cn } from "@/lib/utils";
import type { TaskGroup } from "@/types/task";

interface Props {
    group: TaskGroup;
    setCurrentTaskGroupId: (id: number) => void;
    currentTaskGroupId: number;
}

export default function TaskGroupItem({
    group,
    setCurrentTaskGroupId,
    currentTaskGroupId,
}: Props) {
    return (
        <div
            key={group.id}
            onClick={() => setCurrentTaskGroupId(group.id)}
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
