"use client";
import React from "react";
import GroupList from "@/components/task/group-list";
import TaskList from "@/components/task/task-list";

export default function TaskPage() {
  const [currentGroup, setCurrentGroup] = React.useState(1);
  return (
    <div className="flex h-full w-full gap-2">
      {/* 左侧分组栏 */}
      <GroupList
        currentGroup={currentGroup}
        setCurrentGroup={setCurrentGroup}
      />

      {/* 右侧任务区 */}
      <TaskList currentGroup={currentGroup} />
    </div>
  );
}
