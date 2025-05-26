"use client";
import { InputArea } from "@/components/memo/input-area";
import MemoList from "@/components/memo/memo-list";

export default function MemoPage() {
  return (
    <div className="flex h-full w-full gap-4 justify-center">
      <div className="w-[500px] flex flex-col gap-2">
        <InputArea />
        <MemoList />
      </div>
    </div>
  );
}
