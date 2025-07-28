package types

import (
	"fmt"
	"path/filepath"
	"strings"
	"time"
)

// 支持的文件类型
var SupportedImageTypes = map[string]struct{}{
	"image/jpeg": {},
	"image/jpg":  {},
	"image/png":  {},
	"image/gif":  {},
	"image/webp": {},
}

var SupportedAudioTypes = map[string]struct{}{
	"audio/mpeg": {},
	"audio/mp3":  {},
	"audio/wav":  {},
	"audio/ogg":  {},
	"audio/m4a":  {},
	"audio/aac":  {},
}

var SupportedVideoTypes = map[string]struct{}{
	"video/mp4":       {},
	"video/mpeg":      {},
	"video/quicktime": {},
	"video/x-msvideo": {},
	"video/webm":      {},
}

// 生成对象键
func GenerateObjectKey(fileName string, userID ...string) string {
	ext := filepath.Ext(fileName)
	nameWithoutExt := strings.TrimSuffix(fileName, ext)

	// 如果提供了用户ID，添加到路径中
	if len(userID) > 0 && userID[0] != "" {
		return fmt.Sprintf("uploads/%s/%d_%s%s", userID[0], time.Now().Unix(), nameWithoutExt, ext)
	}

	return fmt.Sprintf("uploads/%d_%s%s", time.Now().Unix(), nameWithoutExt, ext)
}

// 检查文件类型是否支持
func IsValidFileType(contentType string) bool {
	_, isImage := SupportedImageTypes[contentType]
	_, isAudio := SupportedAudioTypes[contentType]
	_, isVideo := SupportedVideoTypes[contentType]

	return isImage || isAudio || isVideo
}

// 获取文件类别
func GetFileCategory(contentType string) string {
	if _, ok := SupportedImageTypes[contentType]; ok {
		return "image"
	}
	if _, ok := SupportedAudioTypes[contentType]; ok {
		return "audio"
	}
	if _, ok := SupportedVideoTypes[contentType]; ok {
		return "video"
	}
	return "unknown"
}
