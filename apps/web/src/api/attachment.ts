import http from "@/lib/http";

export const uploadAttachment = async ({
    url,
    file,
}: {
    url: string;
    file: File;
}) => {
    const res = await http
        .post(url, {
            body: file,
        })
        .json();
    console.log(res);
};
