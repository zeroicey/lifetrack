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

function MediaPreviewModal({ mediaFile, isOpen, onClose }: MediaPreviewModalProps) {
    if (!isOpen || !mediaFile) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="max-w-4xl max-h-4xl w-full h-full p-4 flex items-center justify-center">
                <div className="relative bg-white rounded-lg overflow-hidden max-w-full max-h-full">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    
                    {mediaFile.type.startsWith('image/') && (
                        <img
                            src={mediaFile.url}
                            alt={mediaFile.name}
                            className="max-w-full max-h-full min-w-[300px] min-h-[300px] object-contain"
                            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
                        />
                    )}
                    
                    {mediaFile.type.startsWith('video/') && (
                        <video
                            src={mediaFile.url}
                            controls
                            className="max-w-full max-h-full"
                        />
                    )}
                    
                    {mediaFile.type.startsWith('audio/') && (
                        <div className="p-8 flex flex-col items-center">
                            <div className="text-6xl mb-4">🎵</div>
                            <h3 className="text-lg font-semibold mb-4">{mediaFile.name}</h3>
                            <audio
                                src={mediaFile.url}
                                controls
                                className="w-full max-w-md"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export { MediaPreviewModal };
export default MediaPreviewModal;
export type { MediaPreviewModalProps };
