"use client";
import { DateTimePicker24h } from "@/components/ui/time-picker";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { useGroupQuery, useTasksQuery } from "@/hook/useTaskQuery";

export default function TaskPage() {
  const [currentGroup, setCurrentGroup] = React.useState(1);
  const { data: groups, isLoading } = useGroupQuery();
  const { data: tasks } = useTasksQuery(currentGroup);
  const handleGroupClick = (id: number) => {
    setCurrentGroup(id);
  };
  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col p-4">
      {/* 顶部提交区域
      <div className="flex items-center gap-3 mb-4">
        <Button className="w-28">Submit</Button>
        <Input placeholder="Type something..." className="w-full max-w-md" />
        <DateTimePicker24h />
      </div> */}

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
            <Button>New Group</Button>
          </div>
        </div>

        {/* 右侧任务区 */}
        <div className="flex-1 bg-white rounded-xl shadow-sm overflow-y-auto p-4 space-y-3">
          {tasks?.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition shadow-sm"
            >
              <input type="checkbox" className="mt-1" />
              <p className="text-sm text-gray-800 break-words">
                {task.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
