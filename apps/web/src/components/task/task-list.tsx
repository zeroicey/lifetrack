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
import { Ellipsis, Plus } from "lucide-react";
import { DateTimePicker24h } from "../ui/time-picker";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  currentGroup: number;
}

export default function TaskList({ currentGroup }: Props) {
  const [date, setDate] = React.useState<Date>(new Date());
  const [newTaskContent, setNewTaskContent] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { data: tasks, isPending } = useTasksQuery(currentGroup);
  const { mutate: createTask } = useTaskMutation();
  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-full">
      {/* 滚动区域 */}
      <div className="space-y-3 h-full overflow-y-auto">
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
