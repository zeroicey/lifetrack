import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import MediaPreviewModal, { type MediaFile } from "./media-preview-modal";

interface MomentCreateNineGridProps {
    mediaFiles: MediaFile[];
    onMediaFilesChange: (files: MediaFile[]) => void;
    maxFiles?: number;
}

export default function MomentCreateNineGrid({
    mediaFiles,
    onMediaFilesChange,
    maxFiles = 9,
}: MomentCreateNineGridProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const validFiles: MediaFile[] = [];
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/svg+xml",
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/avi",
            "video/mov",
            "audio/mp3",
            "audio/wav",
            "audio/ogg",
            "audio/aac",
            "audio/flac",
        ];

        Array.from(files).forEach((file) => {
            if (
                allowedTypes.includes(file.type) &&
                mediaFiles.length + validFiles.length < maxFiles
            ) {
                const mediaFile: MediaFile = {
                    id: `${Date.now()}-${Math.random()}`,
                    name: file.name,
                    type: file.type,
                    url: URL.createObjectURL(file),
                    file: file,
                };
                validFiles.push(mediaFile);
            }
        });

        if (validFiles.length > 0) {
            onMediaFilesChange([...mediaFiles, ...validFiles]);
        }

        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveFile = (index: number, e: React.MouseEvent) => {
        e.stopPropagation(); // 阻止事件冒泡
        const fileToRemove = mediaFiles[index];
        // Revoke object URL to prevent memory leaks
        URL.revokeObjectURL(fileToRemove.url);
        const newFiles = mediaFiles.filter((_, i) => i !== index);
        onMediaFilesChange(newFiles);
    };

    const handleFileClick = (mediaFile: MediaFile) => {
        setPreviewFile(mediaFile);
    };

    const handleClosePreview = () => {
        setPreviewFile(null);
    };

    const getFileTypeIcon = (type: string) => {
        if (type.startsWith("image/")) return "🖼️";
        if (type.startsWith("video/")) return "🎥";
        if (type.startsWith("audio/")) return "🎵";
        return "📁";
    };

    const renderMediaPreview = (mediaFile: MediaFile) => {
        if (mediaFile.type.startsWith("image/")) {
            return (
                <img
                    src={mediaFile.url}
                    alt={mediaFile.name}
                    className="w-full h-full object-cover"
                />
            );
        } else if (mediaFile.type.startsWith("video/")) {
            return (
                <video
                    src={mediaFile.url}
                    className="w-full h-full object-cover"
                    muted
                />
            );
        } else {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                    <div className="text-2xl mb-1">
                        {getFileTypeIcon(mediaFile.type)}
                    </div>
                    <div className="text-xs text-center truncate w-full">
                        {mediaFile.name}
                    </div>
                </div>
            );
        }
    };

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
                className="hidden"
            />
            <div className="grid gap-1 grid-cols-3 justify-start">
                {mediaFiles.map((mediaFile, i) => (
                    <div
                        key={mediaFile.id}
                        className="aspect-square w-full border bg-white relative group cursor-pointer overflow-hidden"
                        onClick={() => handleFileClick(mediaFile)}
                    >
                        {renderMediaPreview(mediaFile)}
                        {/* Delete button */}
                        <div
                            className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleRemoveFile(i, e)}
                        >
                            <X className="w-3 h-3 text-white" />
                        </div>
                    </div>
                ))}
                {mediaFiles.length < maxFiles && (
                    <div
                        className="aspect-square w-full border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                        onClick={handleFileSelect}
                    >
                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500 text-center px-1">
                            Add Media
                        </span>
                    </div>
                )}
            </div>

            <MediaPreviewModal
                mediaFile={previewFile!}
                isOpen={!!previewFile}
                onClose={handleClosePreview}
            />
        </div>
    );
}
