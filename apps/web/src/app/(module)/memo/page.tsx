"use client";
import { useMemoQuery } from "@/hook/useMemoQuery";
import { Paperclip, SendHorizonal, Tag } from "lucide-react";

export default function MemoPage() {
  const { data: memos } = useMemoQuery();
  return (
    <div className="flex h-full w-full gap-4">
      {/* 左侧分组栏 */}
      <div className="w-[200px] bg-gray-100">Memo Group List</div>

      {/* 右侧任务区 */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-col gap-0 border hover:border-green-500">
          <textarea
            placeholder="What's on your mind now?"
            id="message"
            className="w-full overflow-auto p-3 border-0 resize-none focus:outline-none text-sm h-25 focus:h-40"
          />
          <div className="border-0 flex items-center justify-between px-4 pb-1">
            <div className="flex items-center  gap-2">
              <Paperclip
                strokeWidth={1.3}
                size={20}
                className="cursor-pointer"
              />
              <span>|</span>
              <Tag strokeWidth={1.3} size={20} className="cursor-pointer" />
            </div>
            <div className="border px-3 py-1 rounded-sm bg-gray-100 cursor-pointer">
              <SendHorizonal
                strokeWidth={1.5}
                size={20}
                className="text-gray-500"
              />
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col gap-2 overflow-y-auto">
          {memos?.map((memo) => {
            return (
              <div className="border p-2" key={memo.id}>
                {memo.content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
