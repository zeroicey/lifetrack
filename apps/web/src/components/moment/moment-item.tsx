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

type Props = {
    moment: Moment;
};

export default function MomentItem({ moment }: Props) {
    const { mutate: deleteMoment } = useMomentDeleteMutation();
    return (
        <div className="border p-2 rounded-md">
            <div className="flex justify-between items-center">
                <span className="text-gray-800 text-sm">
                    {format(new Date(moment.created_at), "dd/MM/yyyy HH:mm")}
                </span>
                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                type="button"
                                aria-label="Delete moment"
                                className="p-1 rounded hover:bg-muted"
                            >
                                <Trash2 size={18} strokeWidth={1.8} className="text-gray-500" />
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this moment?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this moment.
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
            <p className="font-mono whitespace-pre-wrap break-words">
                {moment.content}
            </p>
        </div>
    );
}
