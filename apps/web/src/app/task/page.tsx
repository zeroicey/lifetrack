"use client";
import { DateTimePicker24h } from "@/components/ui/time-picker";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { useGroupQuery, useTasksQuery } from "@/hook/useTaskQuery";
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

export default function TaskPage() {
  const [currentGroup, setCurrentGroup] = React.useState(1);
  const [newGroupName, setNewGroupName] = React.useState("");
  const [newTaskContent, setNewTaskContent] = React.useState("");
  const { data: groups, isLoading } = useGroupQuery();
  const { data: tasks } = useTasksQuery(currentGroup);
  const handleGroupClick = (id: number) => {
    setCurrentGroup(id);
  };
  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col p-4">
      {/* 主体区域 */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* 左侧分组栏 */}
        <div className="w-32 bg-white rounded-xl shadow-sm p-2 flex flex-col justify-between gap-2">
          <div className="overflow-y-auto">
            {groups?.map((group) => {
              const isActive = group.id === currentGroup;
              return (
                <div
                  key={group.id}
                  onClick={() => handleGroupClick(group.id)}
                  className={`cursor-pointer text-center text-sm p-2 mb-1 rounded-md transition
              ${
                isActive
                  ? "bg-blue-500 text-white font-semibold"
                  : "hover:bg-gray-100"
              }`}
                >
                  {group.name}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">New Group</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create a new group</DialogTitle>
                  <DialogDescription>
                    Add a new group to save your tasks in.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-5 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newGroupName}
                      className="col-span-3"
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <Button type="submit">Create</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 右侧任务区 */}
        <div className="relative flex-1 bg-white rounded-xl shadow-sm overflow-y-auto p-4 space-y-3">
          {tasks?.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition shadow-sm"
            >
              <Checkbox />
              <p className="text-sm text-gray-800 break-words">
                {task.content}
              </p>
            </div>
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl shadow-lg hover:bg-blue-600 transition"
                aria-label="新建任务"
              >
                ＋
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>创建新任务</DialogTitle>
                <DialogDescription>为当前分组添加一个新任务</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="task-content">任务内容</Label>
                  <Input
                    id="task-content"
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="task-due">截止时间</Label>
                  <DateTimePicker24h />
                </div>
                <Button>创建</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
