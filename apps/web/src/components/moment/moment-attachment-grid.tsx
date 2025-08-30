import {
    useAttachmentCoverUrl,
    useAttachmentUrl,
} from "@/hooks/use-moment-query";
import type { MomentAttachment } from "@/types/moment";
import { useState } from "react";
import { MediaPreviewModal } from "./media-preview-modal";
import type { MediaFile } from "./media-preview-modal";
import { Play, Image, Loader2 } from "lucide-react";

type Props = {
    attachments: MomentAttachment[];
};

type AttachmentItemProps = {
    attachment: MomentAttachment;
    onPreview: (mediaFile: MediaFile) => void;
};

function AttachmentItem({ attachment, onPreview }: AttachmentItemProps) {
    const {
        data: coverUrlData,
        isPending: coverPending,
        error: coverError,
    } = useAttachmentCoverUrl(attachment.id);
    const {
        data: attachmentUrlData,
        isPending: attachmentPending,
        error: attachmentError,
    } = useAttachmentUrl(attachment.id);
    const [imageLoaded, setImageLoaded] = useState(false);

    const isPending = coverPending || attachmentPending;
    const error = coverError || attachmentError;
    const urlData = coverUrlData; // 显示用封面
    const previewUrlData = attachmentUrlData; // 预览用原文件

    if (isPending) {
        return (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
        );
    }

    if (error || !urlData?.url) {
        return (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-xs">加载失败</span>
            </div>
        );
    }

    const handleClick = () => {
        // 预览时使用原文件URL而不是封面URL
        const mediaFile: MediaFile = {
            id: attachment.id,
            name: attachment.original_name,
            type: attachment.mime_type,
            url: previewUrlData?.url || urlData?.url || "",
        };
        onPreview(mediaFile);
    };

    const isImage = attachment.mime_type.startsWith("image/");
    const isVideo = attachment.mime_type.startsWith("video/");
    const isAudio = attachment.mime_type.startsWith("audio/");

    return (
        <div
            className="w-full h-full rounded-lg overflow-hidden cursor-pointer"
            onClick={handleClick}
        >
            {isImage && (
                <div className="relative w-full h-full">
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image className="w-6 h-6 text-gray-400 animate-pulse" />
                        </div>
                    )}
                    <img
                        src={urlData.url}
                        alt={attachment.original_name}
                        className={`w-full h-full object-cover transition-opacity duration-200 ${
                            imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)}
                    />
                </div>
            )}
            {isVideo && (
                <div className="relative w-full h-full group">
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image className="w-6 h-6 text-gray-400 animate-pulse" />
                        </div>
                    )}
                    <img
                        src={urlData.url}
                        alt={attachment.original_name}
                        className={`w-full h-full object-cover transition-opacity duration-200 ${
                            imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)}
                    />
                    <div
                        className="absolute inset-0 flex items-center justify-center transition-all duration-200 group-hover:bg-black group-hover:bg-opacity-50"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                    >
                        <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center transition-all duration-200 group-hover:bg-opacity-100 group-hover:scale-110 group-hover:shadow-lg">
                            <Play
                                className="w-4 h-4 text-gray-800 ml-0.5 transition-colors duration-200 group-hover:text-black"
                                fill="currentColor"
                            />
                        </div>
                    </div>
                </div>
            )}
            {isAudio && (
                <div className="relative w-full h-full group">
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image className="w-6 h-6 text-gray-400 animate-pulse" />
                        </div>
                    )}
                    <img
                        src={urlData.url}
                        alt={attachment.original_name}
                        className={`w-full h-full object-cover transition-opacity duration-200 ${
                            imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)}
                    />
                    <div
                        className="absolute inset-0 flex items-center justify-center transition-all duration-200 group-hover:bg-black group-hover:bg-opacity-50"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                    >
                        <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center transition-all duration-200 group-hover:bg-opacity-100 group-hover:scale-110 group-hover:shadow-lg">
                            <Play
                                className="w-4 h-4 text-gray-800 ml-0.5 transition-colors duration-200 group-hover:text-black"
                                fill="currentColor"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function MomentAttachmentGrid({ attachments }: Props) {
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

    // 过滤出有效的附件并按position排序
    const validAttachments = attachments
        .filter((attachment) => attachment)
        .sort((a, b) => a.position - b.position);

    const handlePreview = (mediaFile: MediaFile) => {
        setPreviewFile(mediaFile);
    };

    const handleClosePreview = () => {
        setPreviewFile(null);
    };

    if (validAttachments.length === 0) {
        return null;
    }

    return (
        <>
            <div className="grid gap-1 grid-cols-3">
                {validAttachments.map((attachment) => (
                    <div key={attachment.id} className="aspect-square">
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
