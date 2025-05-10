"use client";
import { InputArea } from "@/components/memo/input-area";
import MemoList from "@/components/memo/memo-list";
import React from "react";

export default function MemoPage() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  return (
    <div className="flex h-full w-full gap-4">
      <div className="w-full flex flex-col gap-2">
        <InputArea
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          wrapperRef={wrapperRef}
        />
        <MemoList setIsExpanded={setIsExpanded} />
      </div>
    </div>
  );
}
