import { MemoSelect } from "@lifetrack/response-types";
import { format } from "date-fns";
import { SquarePen, Trash2 } from "lucide-react";
import {
  useMemoDeleteMutation,
  useMemoInfiniteQuery,
  useMemoUpdateMutation,
} from "@/hook/useMemoQuery";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

export default function MemoList() {
  const [editingMemo, setEditingMemo] = React.useState<MemoSelect | null>(null);
  const [contentInput, setContentInput] = React.useState("");
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useMemoInfiniteQuery();

  const { mutate: deleteMemo } = useMemoDeleteMutation();
  const { mutate: updateMemo } = useMemoUpdateMutation();
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-full">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col gap-2 overflow-y-auto no-scrollbar">
      {data?.pages.map((page) =>
        page.items?.map((memo: MemoSelect) => (
          <div className="border p-2 rounded-md" key={memo.id}>
            <div className="flex justify-between items-center">
              <span className="text-gray-800 text-sm">
                {format(new Date(memo.createdAt), "dd/MM/yyyy HH:mm")}
              </span>
              <div className="flex gap-2">
                <Trash2
                  size={18}
                  strokeWidth={1.8}
                  color="gray"
                  onClick={() => deleteMemo(memo.id)}
                  className="cursor-pointer"
                />
                <Dialog
                  open={editingMemo?.id === memo.id}
                  onOpenChange={(open) => {
                    if (open) {
                      setEditingMemo(memo);
                      setContentInput(memo.content); // 打开时设置内容
                    } else {
                      setEditingMemo(null);
                      setContentInput("");
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <SquarePen
                      size={18}
                      strokeWidth={1.8}
                      color="gray"
                      className="cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit memo</DialogTitle>
                      <DialogDescription>
                        Edit the content of this memo.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="content" className="text-right">
                          Content
                        </Label>
                        <Textarea
                          id="content"
                          value={contentInput}
                          onChange={(e) => setContentInput(e.target.value)}
                          className="col-span-3 h-[200px] overflow-y-auto resize-none"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={() => {
                          updateMemo({
                            memoId: memo.id,
                            data: {
                              content: contentInput,
                            },
                          });
                          setEditingMemo(null);
                          setContentInput("");
                        }}
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <p>{memo.content}</p>
          </div>
        ))
      )}
      <div className="text-center text-gray-500 text-sm">
        <Button
          variant={"outline"}
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            "Load more"
          )}
        </Button>
      </div>
    </div>
  );
}
