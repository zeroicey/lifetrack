import { Button } from "@/components/ui/button";
import { useMomentCreateMutation } from "@/hooks/use-moment-query";
import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router";

// 根据图片数量获取容器样式
function getContainerClass(imageCount: number): string {
    if (imageCount === 0) {
        return "justify-start"; // 加号居左
    } else if (imageCount === 1) {
        return "justify-start"; // 1张图片 + 加号居左
    } else if (imageCount === 2) {
        return "justify-start"; // 2张图片 + 加号居左
    } else {
        return "justify-start"; // 3张及以上居左
    }
}

export default function MomentCreatePage() {
    const [textareaValue, setTextareaValue] = useState<string>();
    const [images, setImages] = useState<string[]>([]);
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

                    <div
                        className={`grid gap-1 grid-cols-3 ${getContainerClass(
                            images.length
                        )}`}
                    >
                        {images.map((_image, i) => (
                            <div
                                key={i}
                                className="aspect-square w-full border bg-white relative group cursor-pointer"
                                onClick={() => {
                                    // 删除图片
                                    setImages(
                                        images.filter((_, index) => index !== i)
                                    );
                                }}
                            >
                                {/* 这里将来可以显示实际图片 */}
                                <div className="w-full h-full flex items-center justify-center">
                                    图片{i + 1}
                                </div>
                                {/* 删除按钮 */}
                                <div className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        ))}
                        {images.length < 9 && (
                            <div
                                className="aspect-square w-full border bg-white flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                    // 模拟添加图片
                                    if (images.length < 9) {
                                        setImages([
                                            ...images,
                                            `image-${images.length + 1}`,
                                        ]);
                                    }
                                }}
                            >
                                <Plus className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
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
