import { useMomentDeleteMutation } from "@/hooks/use-moment-query";
import type { Moment } from "@/types/moment";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import MomentAttachmentGrid from "./moment-attachment-grid";

type Props = {
    moment: Moment;
};

export default function MomentItem({ moment }: Props) {
    const { mutate: deleteMoment } = useMomentDeleteMutation();
    return (
        <div className="flex flex-col gap-2 max-w-[600px] w-full">
            <p className="font-mono whitespace-pre-wrap break-words text-xl">
                {moment.content}
            </p>

            {moment.attachments && moment.attachments.length > 0 && (
                <MomentAttachmentGrid attachments={moment.attachments} />
            )}
            <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500 text">
                    {format(new Date(moment.created_at), "MM-dd HH:mm")}
                </span>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Trash2
                            size={17}
                            strokeWidth={1.8}
                            className="text-gray-500 cursor-pointer hover:text-red-500"
                        />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete this moment?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this moment.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    deleteMoment(moment.id);
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
