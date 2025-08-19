import { useAttachmentUrl } from "@/hooks/use-moment-query";
import type { MomentAttachment } from "@/types/moment";
import { useState } from "react";
import { MediaPreviewModal } from "./media-preview-modal";
import type { MediaFile } from "./media-preview-modal";

type Props = {
    attachments: MomentAttachment[];
};

type AttachmentItemProps = {
    attachment: MomentAttachment;
    onPreview: (mediaFile: MediaFile) => void;
};

function AttachmentItem({ attachment, onPreview }: AttachmentItemProps) {
    const { data: urlData, isLoading, error } = useAttachmentUrl(attachment.id);

    if (isLoading) {
        return (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error || !urlData?.url) {
        console.log(urlData, error);
        return (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-xs">加载失败</span>
            </div>
        );
    }

    const handleClick = () => {
        const mediaFile: MediaFile = {
            id: attachment.id,
            name: attachment.original_name,
            type: attachment.mime_type,
            url: urlData.url,
        };
        onPreview(mediaFile);
    };

    const isImage = attachment.mime_type.startsWith("image/");
    const isVideo = attachment.mime_type.startsWith("video/");
    const isAudio = attachment.mime_type.startsWith("audio/");

    return (
        <div
            className="w-full h-full bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleClick}
        >
            {isImage && (
                <img
                    src={urlData.url}
                    alt={attachment.original_name}
                    className="w-full h-full object-cover"
                />
            )}
            {isVideo && (
                <div className="relative w-full h-full">
                    <video
                        src={urlData.url}
                        className="w-full h-full object-cover"
                        muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[6px] border-l-gray-800 border-y-[4px] border-y-transparent ml-1"></div>
                        </div>
                    </div>
                </div>
            )}
            {isAudio && (
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <span className="text-xs text-gray-600 text-center truncate w-full">
                        {attachment.original_name}
                    </span>
                </div>
            )}
        </div>
    );
}

export default function MomentAttachmentGrid({ attachments }: Props) {
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

    // 过滤出有效的附件并按position排序
    const validAttachments = attachments
        .filter(attachment => attachment)
        .sort((a, b) => a.position - b.position);

    const handlePreview = (mediaFile: MediaFile) => {
        setPreviewFile(mediaFile);
    };

    const handleClosePreview = () => {
        setPreviewFile(null);
    };

    // 根据附件数量决定布局
    const getGridLayout = (count: number) => {
        if (count === 0) return "";
        if (count === 1) return "grid-cols-1";
        if (count === 2) return "grid-cols-2";
        return "grid-cols-3";
    };

    if (validAttachments.length === 0) {
        return null;
    }

    return (
        <>
            <div className={`grid gap-1 mt-3 ${getGridLayout(validAttachments.length)}`}>
                {validAttachments.map((attachment) => (
                    <div 
                        key={attachment.id} 
                        className="aspect-square"
                    >
                        <AttachmentItem
                            attachment={attachment}
                            onPreview={handlePreview}
                        />
                    </div>
                ))}
            </div>

            {previewFile && (
                <MediaPreviewModal
                    mediaFile={previewFile}
                    isOpen={!!previewFile}
                    onClose={handleClosePreview}
                />
            )}
        </>
    );
}
