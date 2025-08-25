import { apiCreateMoment, apiDeleteMoment, apiGetMoments } from "@/api/moment";
import {
    apiGetAttachmentUrl,
    apiGetPresignedURL,
    apiUploadAttachment,
    apiCompleteUpload,
} from "@/api/attachment";
import type { Moment } from "@/types/moment";
import type { MediaFile } from "@/components/moment/media-preview-modal";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    type InfiniteData,
    type QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

const queryKey: QueryKey = ["list-moments"];

export const useMomentInfiniteQuery = () => {
    return useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => apiGetMoments({ cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: 0,
    });
};

export interface CreateMomentBody {
    content: string;
    attachments?: MediaFile[];
}

export const useMomentCreateMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ content, attachments = [] }: CreateMomentBody) => {
            // 1. 上传所有附件
            const uploadedAttachments = [];

            // 检查所有附件是否都有文件
            for (const attachment of attachments) {
                if (!attachment.file) {
                    throw new Error(
                        `File not found for attachment: ${attachment.name}`
                    );
                }
            }

            // 批量获取预签名 URL
            const files = attachments.map((attachment) => attachment.file!);
            const presignedDataList = await apiGetPresignedURL(files);
            if (
                !presignedDataList ||
                presignedDataList.length !== files.length
            ) {
                throw new Error("Failed to get presigned URLs for attachments");
            }
            console.log("presignedDataList", presignedDataList);

            // 处理每个附件的上传
            for (let i = 0; i < attachments.length; i++) {
                const attachment = attachments[i];
                const presignedData = presignedDataList[i];

                // 如果不是秒传，则上传文件到预签名 URL
                if (!presignedData.is_duplicate) {
                    try {
                        await apiUploadAttachment({
                            url: presignedData.upload_url!,
                            file: attachment.file!,
                        });
                    } catch (error) {
                        throw new Error(
                            `Failed to upload attachment ${attachment.name}: ${error}`
                        );
                    }

                    // 通知后端上传完成
                    try {
                        await apiCompleteUpload(presignedData.attachment_id);
                    } catch (error) {
                        throw new Error(
                            `Failed to complete upload for attachment ${attachment.name}: ${error}`
                        );
                    }
                }

                uploadedAttachments.push({
                    attachment_id: presignedData.attachment_id,
                    position: uploadedAttachments.length,
                });
            }

            // 2. 创建 moment
            const moment = await apiCreateMoment({
                content,
                attachments: uploadedAttachments.map((attachment) => ({
                    attachment_id: attachment.attachment_id,
                    position: attachment.position,
                })),
            });
            if (!moment || !moment.id) {
                throw new Error(
                    "Failed to create moment: Invalid response from server"
                );
            }
            return moment;
        },
        onSuccess: () => {
            toast.success("Create moment with attachments successfully!");
        },
        onError: (error) => {
            console.error("Failed to create moment with attachments:", error);
            toast.error("Create moment with attachments failed!");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};

export const useAttachmentUrl = (attachmentId: string) => {
    return useQuery({
        queryKey: ["attachment-url", attachmentId],
        queryFn: () => {
            return apiGetAttachmentUrl(attachmentId);
        },
        staleTime: 5 * 60 * 1000, // 5分钟缓存
        enabled: !!attachmentId,
    });
};

export const useMomentDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: apiDeleteMoment,
        onSuccess: () => {
            toast.success("Delete moment successfully!");
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey });
            const previousMoments = queryClient.getQueryData<
                InfiniteData<
                    {
                        items: Moment[];
                        nextCursor: number | null;
                    },
                    number | undefined
                >
            >(queryKey);

            queryClient.setQueryData<
                InfiniteData<
                    {
                        items: Moment[];
                        nextCursor: number | null;
                    },
                    number | undefined
                >
            >(queryKey, (oldData) => {
                const firstPage = oldData?.pages[0];
                if (firstPage) {
                    return {
                        ...oldData,
                        pages: [
                            {
                                ...firstPage,
                                items: firstPage.items.filter(
                                    (item) => item.id !== id
                                ),
                            },
                            ...oldData.pages.slice(1),
                        ],
                    };
                }
            });

            return { previousMoments };
        },
        onError: (_error, _variables, context) => {
            queryClient.setQueryData(queryKey, context?.previousMoments);
            toast.error("Delete moment failed!");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};
