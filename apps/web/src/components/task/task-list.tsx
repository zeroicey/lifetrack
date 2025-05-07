"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { useTasksQuery } from "@/hook/useTaskQuery";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Props {
  currentGroup: number;
}

export default function TaskList({ currentGroup }: Props) {
  const [newTaskContent, setNewTaskContent] = React.useState("");
  const { data: tasks, isLoading } = useTasksQuery(currentGroup);
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">Loading...</div>
    );
  }
  return (
    <div className="relative flex-1 border">
      {/* 滚动区域 */}
      <div className="overflow-y-auto p-4 space-y-3 h-full">
        {tasks?.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-3 rounded-lg border"
          >
            <Checkbox />
            <p className="text-sm text-gray-800 break-words">{task.content}</p>
          </div>
        ))}
      </div>

      {/* 加号按钮浮动在右下角，保持不动 */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl shadow-lg hover:bg-blue-600 transition"
            aria-label="新建任务"
          >
            <Plus />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>创建新任务</DialogTitle>
            <DialogDescription>为当前分组添加一个新任务</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="task-content">Content</Label>
              <Input
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="task-due">Deadline</Label>
            </div>
            <Button onClick={() => {}}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
