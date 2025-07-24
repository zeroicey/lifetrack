import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export default function MomentCreatePage() {
    const [textareaValue, setTextareaValue] = useState<string>();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // 先重置高度
            textarea.style.height = `${Math.max(textarea.scrollHeight, 100)}px`; // 设置为内容高度
        }
    }, [textareaValue]);
    return (
        <div className="overflow-auto h-full w-full flex justify-center">
            <div className="w-[350px] h-full flex flex-col">
                <div className="overflow-auto flex-1 space-y-1 no-scrollbar">
                    <div>
                        <textarea
                            ref={textareaRef}
                            className="w-full p-2 resize-none h-32 focus:outline-none min-h-[100px]"
                            value={textareaValue}
                            onChange={(e) => setTextareaValue(e.target.value)}
                            placeholder="What's on your mind?"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square w-full border bg-white"
                            ></div>
                        ))}
                    </div>
                </div>

                <div className="w-full flex justify-around gap-5 border-t p-4">
                    <Button variant="default">Create</Button>
                    <Button variant="secondary">Cancel</Button>
                </div>
            </div>
        </div>
    );
}
