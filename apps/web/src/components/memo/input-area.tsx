import { useMemoCreateMutation } from "@/hook/useMemoQuery";
import { cn } from "@/lib/utils";
import { Paperclip, SendHorizonal, Tag } from "lucide-react";
import React from "react";

export const InputArea = () => {
  const { mutate: createMemo } = useMemoCreateMutation();
  const [inputValue, setInputValue] = React.useState("");
  return (
    <div
      tabIndex={0}
      className="flex flex-col gap-0 border hover:border-green-500 h-50 rounded-md"
    >
      <textarea
        placeholder="What's on your mind now?"
        id="message"
        className="w-full overflow-auto p-3 border-0 resize-none focus:outline-none text-sm h-full"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="border-0 flex items-center justify-between px-4 pb-1">
        <div className="flex items-center  gap-2">
          <Paperclip strokeWidth={1.3} size={20} className="cursor-pointer" />
          <span>|</span>
          <Tag strokeWidth={1.3} size={20} className="cursor-pointer" />
        </div>
        <div className="border px-3 py-1 rounded-sm bg-gray-100 cursor-pointer">
          <SendHorizonal
            strokeWidth={1.5}
            size={20}
            className="text-gray-500"
            onClick={() => {
              createMemo({ content: inputValue, userId: 1 });
              setInputValue("");
            }}
          />
        </div>
      </div>
    </div>
  );
};
