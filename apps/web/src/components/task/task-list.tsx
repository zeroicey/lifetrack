import { useTaskQuery, useTaskUpdateMutation } from "@/hooks/use-task-query";
import {
    closestCorners,
    DndContext,
    type DragEndEvent,
    type DragStartEvent,
    DragOverlay,
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
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type Task } from "@/types/task";
import TaskItem from "./task-item";
import { generateKeyBetween } from "fractional-indexing";
import { useQueryClient } from "@tanstack/react-query";
import { useSettingStore } from "@/stores/setting";
import { useState } from "react";
import { toast } from "sonner";

export default function TaskList() {
    const queryClient = useQueryClient();
    const { currentTaskGroupId } = useSettingStore();
    const taskQueryKey = ["list-tasks", currentTaskGroupId];

    const { data: tasks = [], isLoading, error } = useTaskQuery();
    const { mutate: updateTask } = useTaskUpdateMutation({ invalidate: false });
    const [activeTask, setActiveTask] = useState<Task | null>(null);

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

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);

        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;

        const oldIndex = tasks.findIndex((t) => t.id === active.id);
        const newIndex = tasks.findIndex((t) => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        // 1. Optimistically update the UI with the new order
        const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
        queryClient.setQueryData<Task[]>(taskQueryKey, reorderedTasks);

        // 2. Calculate the new position for the moved task
        try {
            const movedTask = reorderedTasks[newIndex];
            const prevTask = reorderedTasks[newIndex - 1];
            const nextTask = reorderedTasks[newIndex + 1];

            const newPos = generateKeyBetween(
                prevTask?.pos ?? null,
                nextTask?.pos ?? null
            );
            const updatedTask = { ...movedTask, pos: newPos };
            updateTask(updatedTask);
        } catch (e) {
            console.error(e);
            toast.error("Update task failed!");
            queryClient.invalidateQueries({ queryKey: taskQueryKey });
        }

        // 3. Call the mutation to update the backend
    };

    const renderStatusMessage = (message: string, isError = false) => (
        <div className="flex items-center justify-center p-8 w-full h-full">
            <div className={isError ? "text-red-500" : "text-gray-500"}>
                {message}
            </div>
        </div>
    );
    if (currentTaskGroupId === -1)
        return renderStatusMessage("No task group created yet");
    if (isLoading) return renderStatusMessage("Loading tasks...");
    if (error) return renderStatusMessage("Error loading tasks", true);
    if (!tasks || tasks.length === 0)
        return renderStatusMessage("No tasks found");

    return (
        <div className="w-full h-full overflow-auto no-scrollbar">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
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
                <DragOverlay>
                    {activeTask ? (
                        <TaskItem task={activeTask} isOverlay />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
