import type { Moment } from "@/types/moment";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

type Props = {
    moment: Moment;
};

export default function MomentItem({ moment }: Props) {
    return (
        <div className="border p-2 rounded-md">
            <div className="flex justify-between items-center">
                <span className="text-gray-800 text-sm">
                    {format(new Date(moment.created_at), "dd/MM/yyyy HH:mm")}
                </span>
                <div className="flex gap-2">
                    <Trash2
                        size={18}
                        strokeWidth={1.8}
                        color="gray"
                        className="cursor-pointer"
                    />
                </div>
            </div>
            <p className="font-mono whitespace-pre-wrap break-words">
                {moment.content}
            </p>
        </div>
    );
}
