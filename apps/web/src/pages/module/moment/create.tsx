import { Button } from "@/components/ui/button";
import { useMomentCreateMutation } from "@/hooks/use-moment-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MomentCreateNineGrid from "@/components/moment/moment-create-nine-grid";
import { type MediaFile } from "@/components/moment/media-preview-modal";

export default function MomentCreatePage() {
    const [textareaValue, setTextareaValue] = useState<string>(""); // 初始化为空字符串
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { mutate } = useMomentCreateMutation();
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // 先重置高度
            textarea.style.height = `${Math.max(textarea.scrollHeight, 150)}px`; // 设置为内容高度
        }
    }, [textareaValue]);
    useEffect(() => {
        const textarea = textareaRef.current;
        textarea?.focus();
    }, []);
    return (
        <div className="overflow-auto h-full w-full flex justify-center">
            <div className="max-w-[350px] w-full h-full flex flex-col">
                <div className="overflow-auto flex-1 space-y-1 no-scrollbar">
                    <div>
                        <textarea
                            ref={textareaRef}
                            className="w-full p-2 resize-none focus:outline-none min-h-[150px]"
                            value={textareaValue}
                            onChange={(e) => setTextareaValue(e.target.value)}
                            placeholder="What's on your mind?"
                        />
                    </div>

                    <MomentCreateNineGrid
                        mediaFiles={mediaFiles}
                        onMediaFilesChange={setMediaFiles}
                    />
                </div>

                <div className="w-full flex justify-around gap-5 border-t p-4">
                    <Button
                        variant="default"
                        onClick={() => {
                            if (textareaValue?.trim() === "") {
                                return;
                            }
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
