import { X } from "lucide-react";

export interface MediaFile {
    id: string;
    name: string;
    type: string;
    url: string;
    file?: File;
}

interface MediaPreviewModalProps {
    mediaFile: MediaFile | null;
    isOpen: boolean;
    onClose: () => void;
}

function MediaPreviewModal({
    mediaFile,
    isOpen,
    onClose,
}: MediaPreviewModalProps) {
    if (!isOpen || !mediaFile) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            onClick={handleBackdropClick}
        >
            {!mediaFile.type.startsWith("audio/") && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-500 opacity-80 text-white rounded-full p-2 hover:bg-black shadow-lg z-10"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
            <div className="relative overflow-hidden max-w-full max-h-full">
                {mediaFile.type.startsWith("image/") && (
                    <img
                        src={mediaFile.url}
                        alt={mediaFile.name}
                        style={{ maxWidth: "90vw", maxHeight: "90vh" }}
                    />
                )}

                {mediaFile.type.startsWith("video/") && (
                    <video
                        src={mediaFile.url}
                        controls
                        style={{ maxWidth: "90vw", maxHeight: "90vh" }}
                    />
                )}

                {mediaFile.type.startsWith("audio/") && (
                    <audio src={mediaFile.url} controls />
                )}
            </div>
        </div>
    );
}

export { MediaPreviewModal };
export default MediaPreviewModal;
export type { MediaPreviewModalProps };
