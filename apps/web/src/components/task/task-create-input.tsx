import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTaskCreateMutation, useTaskQuery } from "@/hooks/use-task-query";
import { useSettingStore } from "@/stores/setting";
import { generateKeyBetween } from "fractional-indexing";

export default function TaskCreateInput() {
    const [taskContent, setTaskContent] = useState("");
    const { currentTaskGroupId } = useSettingStore();
    const { mutate: createTask } = useTaskCreateMutation();
    const { data: tasks, isPending } = useTaskQuery();

    const handleSubmit = () => {
        if (taskContent.trim() && !isPending) {
            const _tasks = tasks || [];
            let pos;
            if (_tasks.length === 0) {
                pos = generateKeyBetween(null, null);
            } else {
                pos = generateKeyBetween(_tasks[_tasks.length - 1].pos, null);
            }
            createTask({
                content: taskContent.trim(),
                group_id: currentTaskGroupId,
                pos,
            });
            setTaskContent("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="flex items-center w-full">
            <input
                value={taskContent}
                onChange={(e) => setTaskContent(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a task..."
                className="flex-1 rounded-none focus-visible:ring-0 border-t py-1.5 px-3 outline-none"
            />
            <Button
                onClick={handleSubmit}
                disabled={!taskContent.trim()}
                className="rounded-none h-full"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}
