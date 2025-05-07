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
    <div className="flex h-screen w-screen items-center flex-col p-2">
      <div className="flex items-center flex-col">
        <Button className="w-1/2" variant="outline">
          Submit
        </Button>
        <Input type="text" placeholder="Type here..." className="w-full" />
        <DateTimePicker24h />
      </div>
      <div className="flex border p-2 m-2 rounded-md w-full h-full">
        <div className="border p-2 m-2 rounded-md overflow-y-auto">
          {groups?.map((group) => {
            if (currentGroup === group.id) {
              return (
                <div
                  className={`flex items-center justify-center gap-2 border p-2 bg-blue-500 text-white`}
                  key={group.id}
                >
                  {group.name}
                </div>
              );
            }
            return (
              <div
                className={"flex items-center justify-center gap-2 border p-2"}
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
              >
                {group.name}
              </div>
            );
          })}
        </div>
        <div className="border p-2 m-2 rounded-md flex-grow overflow-y-auto">
          {tasks?.map((task) => {
            return (
              <div
                className="border p-2 m-2 rounded-md flex gap-2"
                key={task.id}
              >
                <input type="checkbox" />
                {task.content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
