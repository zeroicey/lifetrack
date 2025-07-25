import { Button } from "@/components/ui/button";
import { useMomentCreateMutation } from "@/hooks/use-moment-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

export default function MomentCreatePage() {
    const [textareaValue, setTextareaValue] = useState<string>();
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { mutate } = useMomentCreateMutation();
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // 先重置高度
            textarea.style.height = `${Math.max(textarea.scrollHeight, 100)}px`; // 设置为内容高度
        }
    }, [textareaValue]);
    useEffect(() => {
        const textarea = textareaRef.current;
        textarea?.focus();
    }, []);
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
                    <Button
                        variant="default"
                        onClick={() => {
                            mutate({ content: textareaValue });
                        }}
                    >
                        Create
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setTextareaValue("");
                            navigate("/moment");
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
