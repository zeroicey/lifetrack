// 移除 text-to-image 导入，改用 Canvas 生成音频封面

export const generateFileCover = async (
    file: File,
    fileType: string,
    maxTextLength?: number
): Promise<File> => {
    if (fileType.startsWith("image")) {
        return generateImageThumbnail(file);
    } else if (fileType.startsWith("video")) {
        return generateVideoThumbnail(file);
    } else if (fileType.startsWith("audio")) {
        return generateAudioThumbnail(file, maxTextLength);
    } else {
        throw new Error("Unsupported file type");
    }
};

export const generateImageThumbnail = async (file: File): Promise<File> => {
    try {
        const image = await loadImage(file);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Failed to get canvas context");
        }

        // 设置缩略图尺寸为正方形
        const size = 150; // 你可以自定义正方形的边长

        // 设置画布大小为正方形
        canvas.width = size;
        canvas.height = size;

        // 计算从原图中心裁剪正方形的参数
        let sourceX, sourceY, sourceDimension;

        if (image.width < image.height) {
            // 宽小于高，以宽为基准
            sourceDimension = image.width;
            sourceX = 0;
            sourceY = (image.height - image.width) / 2;
        } else {
            // 高小于等于宽，以高为基准
            sourceDimension = image.height;
            sourceX = (image.width - image.height) / 2;
            sourceY = 0;
        }

        // 将原图的中心正方形区域绘制到画布上，缩放到目标尺寸
        ctx.drawImage(
            image,
            sourceX,
            sourceY,
            sourceDimension,
            sourceDimension, // 源图片的裁剪区域
            0,
            0,
            size,
            size // 目标画布的绘制区域
        );

        // 优先生成 WebP 格式，如果不支持则使用 JPEG
        let dataUrl: string;
        let mimeType: string;

        // 尝试生成 WebP 格式
        const webpDataUrl = canvas.toDataURL("image/webp", 0.8);
        if (webpDataUrl.startsWith("data:image/webp")) {
            dataUrl = webpDataUrl;
            mimeType = "image/webp";
        } else {
            // 如果不支持 WebP，则使用 JPEG
            dataUrl = canvas.toDataURL("image/jpeg", 0.8);
            mimeType = "image/jpeg";
        }

        // 转换为 Blob 文件并返回
        const blob = await fetch(dataUrl).then((res) => res.blob());

        // 根据生成的格式设置正确的文件扩展名
        const fileExtension = mimeType === "image/webp" ? "webp" : "jpg";
        const fileName =
            file.name.replace(/\.[^/.]+$/, "") + "." + fileExtension;

        return new File([blob], fileName, { type: mimeType });
    } catch (error) {
        console.error("Error generating image thumbnail:", error);
        throw new Error("Failed to generate image thumbnail");
    }
};

// 辅助函数，用于加载图片文件
const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);

        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image"));
    });
};

export const generateVideoThumbnail = async (file: File): Promise<File> => {
    try {
        const video = await loadVideo(file);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Failed to get canvas context");
        }

        // 设置缩略图尺寸为正方形
        const size = 150; // 你可以自定义正方形的边长

        // 设置画布尺寸
        canvas.width = size;
        canvas.height = size;

        // 实现正方形居中裁剪，类似于图片缩略图的逻辑
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        let sourceX = 0;
        let sourceY = 0;
        let sourceSize = 0;

        if (videoWidth < videoHeight) {
            // 视频宽度小于高度，以宽度为基准裁剪正方形，垂直居中
            sourceSize = videoWidth;
            sourceX = 0;
            sourceY = (videoHeight - videoWidth) / 2;
        } else {
            // 视频高度小于等于宽度，以高度为基准裁剪正方形，水平居中
            sourceSize = videoHeight;
            sourceX = (videoWidth - videoHeight) / 2;
            sourceY = 0;
        }

        // 绘制裁剪后的正方形视频帧到画布
        ctx.drawImage(
            video,
            sourceX,
            sourceY,
            sourceSize,
            sourceSize, // 源区域
            0,
            0,
            size,
            size // 目标区域
        );

        // 优先生成 WebP 格式，如果不支持则使用 JPEG
        let dataUrl: string;
        let mimeType: string;

        // 尝试生成 WebP 格式
        const webpDataUrl = canvas.toDataURL("image/webp", 0.8);
        if (webpDataUrl.startsWith("data:image/webp")) {
            dataUrl = webpDataUrl;
            mimeType = "image/webp";
        } else {
            // 如果不支持 WebP，则使用 JPEG
            dataUrl = canvas.toDataURL("image/jpeg", 0.8);
            mimeType = "image/jpeg";
        }

        // 转换为 Blob 文件并返回
        const blob = await fetch(dataUrl).then((res) => res.blob());

        // 根据生成的格式设置正确的文件扩展名
        const fileExtension = mimeType === "image/webp" ? "webp" : "jpg";
        const fileName =
            file.name.replace(/\.[^/.]+$/, "") + "." + fileExtension;

        return new File([blob], fileName, { type: mimeType });
    } catch (error) {
        console.error("Error generating video thumbnail:", error);
        throw new Error("Failed to generate video thumbnail");
    }
};

// 辅助函数，用于加载视频文件
const loadVideo = (file: File): Promise<HTMLVideoElement> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        const reader = new FileReader();

        reader.onload = (e) => {
            video.src = e.target?.result as string;
        };

        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);

        video.onloadeddata = () => {
            // 设置视频时间到1秒处（或视频长度的10%，取较小值）
            const seekTime = Math.min(1, video.duration * 0.1);
            video.currentTime = seekTime;
        };

        video.onseeked = () => {
            // 确保视频已经跳转到指定时间点后再resolve
            resolve(video);
        };

        video.onerror = () => reject(new Error("Failed to load video"));
    });
};

export const generateAudioThumbnail = async (file: File, maxTextLength: number = 20): Promise<File> => {
    try {
        // 使用音频文件名生成封面文本，移除文件扩展名
        let text = file.name.replace(/\.[^/.]+$/, "");
        
        // 控制文字长度，超出部分用省略号截断
        if (text.length > maxTextLength) {
            text = text.substring(0, maxTextLength - 3) + "...";
        }

        // 使用 Canvas 生成正方形音频封面
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
            throw new Error("Failed to get canvas context");
        }

        // 设置画布尺寸为正方形
        const size = 150;
        canvas.width = size;
        canvas.height = size;

        // 绘制背景
        ctx.fillStyle = "#1a1a1a"; // 深灰色背景，音频风格
        ctx.fillRect(0, 0, size, size);

        // 设置文字样式
        ctx.fillStyle = "#00d4aa"; // 青绿色文字
        ctx.font = "16px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // 在画布中心绘制文字
        ctx.fillText(text, size / 2, size / 2);

        // 将 Canvas 转换为 Blob
        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Failed to convert canvas to blob"));
                }
            }, "image/webp", 0.9);
        });

        // 创建 WebP 格式的文件
        const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
        const webpFile = new File([blob], fileName, {
            type: "image/webp",
        });

        return webpFile;
    } catch (error) {
        console.error("Error generating audio thumbnail:", error);
        throw new Error("Failed to generate audio thumbnail");
    }
};
