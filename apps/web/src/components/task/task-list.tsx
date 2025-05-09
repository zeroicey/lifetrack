"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { useTaskMutation, useTasksQuery } from "@/hook/useTaskQuery";
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
import { Ellipsis, EllipsisIcon, MoreHorizontal, Plus } from "lucide-react";
import { DateTimePicker24h } from "../ui/time-picker";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  currentGroup: number;
}

export default function TaskList({ currentGroup }: Props) {
  const [date, setDate] = React.useState<Date>(new Date());
  const [newTaskContent, setNewTaskContent] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { data: tasks, isLoading } = useTasksQuery(currentGroup);
  const { mutate: createTask } = useTaskMutation();
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
          <div key={task.id} className="flex flex-col border p-2 gap-1">
            <div className="flex items-center justify-between border px-1">
              <span className="text-gray-800 text-sm">
                {format(task.createdAt, "yyyy-MM-dd HH:mm:ss")}
              </span>
              <span className="text-gray-800 text-sm">
                {format(task.deadline, "yyyy-MM-dd HH:mm:ss")}
              </span>
            </div>
            <div className="flex items-center border p-1 gap-1">
              <div className="flex gap-3 items-center border p-1 flex-grow">
                <Checkbox
                  checked={task.state === "DONE"}
                  onClick={() => {
                    console.log("change task state", task.id, task.state);
                  }}
                />
                <p className="text-sm text-gray-800 break-words">
                  {task.content}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* 加号按钮浮动在右下角，保持不动 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl shadow-lg hover:bg-blue-600 transition"
            aria-label="Create a new task"
          >
            <Plus />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new task</DialogTitle>
            <DialogDescription>
              Create a new task for the current group.
            </DialogDescription>
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
              <DateTimePicker24h date={date} setDate={setDate} />
            </div>
            <Button
              onClick={() => {
                console.log("create task", newTaskContent, date);
                createTask({
                  groupId: currentGroup,
                  content: newTaskContent,
                  deadline: date,
                });
                setDialogOpen(false);
              }}
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
