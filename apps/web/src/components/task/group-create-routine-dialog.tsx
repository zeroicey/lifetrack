import { Plus } from "lucide-react";
import { useState } from "react";
import { useGroupCreateMutation } from "@/hooks/use-task-query";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
export default function GroupCreateRoutineDialog() {
    const { mutate: createGroup } = useGroupCreateMutation();
    const [dialogCreateOpen, setDialogCreateOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
        <Dialog open={dialogCreateOpen} onOpenChange={setDialogCreateOpen}>
            <DialogTrigger asChild>
                <div className="inline-flex items-center w-full gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    Routine group
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg border"
                />
            </DialogContent>
        </Dialog>
    );
}
