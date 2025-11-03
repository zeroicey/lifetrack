package pkg

import (
	"bytes"
	"context"
	"image"

	"github.com/disintegration/imaging"
	"github.com/gofiber/fiber/v2/log"
	"github.com/minio/minio-go/v7"
)

func ProcessThumbnail(minioClient *minio.Client, filePath string, bucketName string) {
	ctx := context.Background()

	obj, err := minioClient.GetObject(ctx, bucketName, filePath, minio.GetObjectOptions{})
	if err != nil {
		log.Infof("下载图片失败:", err)
		return
	}
	defer obj.Close()

	img, _, err := image.Decode(obj)
	if err != nil {
		log.Infof("图片解码失败:", err)
		return
	}

	thumb := imaging.Resize(img, 300, 0, imaging.Lanczos)

	// 3️⃣ 转成 buffer 以便重新上传
	buf := new(bytes.Buffer)
	if err := imaging.Encode(buf, thumb, imaging.JPEG); err != nil {
		log.Infof("图片编码失败:", err)
		return
	}

	// 4️⃣ 上传缩略图到 MinIO
	thumbPath := "thumbnails/" + filePath
	_, err = minioClient.PutObject(ctx, bucketName, thumbPath, buf, int64(buf.Len()), minio.PutObjectOptions{
		ContentType: "image/jpeg",
	})
	if err != nil {
		log.Errorf("上传缩略图失败:", err)
		return
	}

	log.Infof("✅ 缩略图生成成功: %s\n", thumbPath)
}
