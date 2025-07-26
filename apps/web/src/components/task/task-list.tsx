import { useTasksQuery, useTaskUpdateMutation } from "@/hooks/use-task-query";
import {
    closestCorners,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    restrictToVerticalAxis,
    restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type Task } from "@/types/task";
import TaskItem from "./task-item";
import { generateKeyBetween } from "fractional-indexing";
import { useQueryClient } from "@tanstack/react-query";
import { useSettingStore } from "@/stores/setting";

export default function TaskList() {
    const queryClient = useQueryClient();
    const { currentTaskGroupId } = useSettingStore();
    const taskQueryKey = ["list-tasks", currentTaskGroupId];

    const { data: tasks = [], isLoading, error } = useTasksQuery();
    const { mutate: updateTask } = useTaskUpdateMutation();

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;

        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);
        if (activeIndex === -1 || overIndex === -1) return;

        const isMovingDown = activeIndex < overIndex;
        let newPos: string;

        if (isMovingDown) {
            if (overIndex === tasks.length - 1) {
                newPos = generateKeyBetween(tasks[overIndex].pos, null);
            } else {
                newPos = generateKeyBetween(
                    tasks[overIndex].pos,
                    tasks[overIndex + 1].pos
                );
            }
        } else {
            if (overIndex === 0) {
                newPos = generateKeyBetween(null, tasks[0].pos);
            } else {
                newPos = generateKeyBetween(
                    tasks[overIndex - 1].pos,
                    tasks[overIndex].pos
                );
            }
        }

        const activeTask = tasks[activeIndex];
        const updatedTask = { ...activeTask, pos: newPos };

        const updatedList = tasks
            .map((t) => (t.id === activeTask.id ? updatedTask : t))
            .sort((a, b) => a.pos.localeCompare(b.pos));

        queryClient.setQueryData<Task[]>(taskQueryKey, updatedList);

        updateTask(updatedTask);
    };

    const renderStatusMessage = (message: string, isError = false) => (
        <div className="flex items-center justify-center p-8 w-full h-full">
            <div className={isError ? "text-red-500" : "text-gray-500"}>
                {message}
            </div>
        </div>
    );
    if (isLoading) return renderStatusMessage("Loading tasks...");
    if (error) return renderStatusMessage("Error loading tasks", true);
    if (!tasks || tasks.length === 0)
        return renderStatusMessage("No tasks found");

    return (
        <div className="w-full h-full overflow-auto no-scrollbar">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            >
                <SortableContext
                    items={tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}
