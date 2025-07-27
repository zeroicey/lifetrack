import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useGroupCreateMutation } from "@/hooks/use-task-query";
import { Button } from "@/components/ui/button";
export default function GroupCreateDialog() {
    const { mutate: createGroup } = useGroupCreateMutation();
    const [nameValue, setNameValue] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");
    const [dialogCreateOpen, setDialogCreateOpen] = useState(false);
    return (
        <Dialog open={dialogCreateOpen} onOpenChange={setDialogCreateOpen}>
            <DialogTrigger asChild>
                <div className="inline-flex items-center w-full gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    Custom group
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Create Custom group
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Create a new task group to organize your tasks.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Group Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={nameValue}
                            placeholder="Enter group name"
                            className="w-full"
                            onChange={(e) => setNameValue(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="description"
                            className="text-sm font-medium text-gray-700"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={descriptionValue}
                            placeholder="Enter group description (optional)"
                            className="w-full min-h-[80px] resize-none"
                            onChange={(e) =>
                                setDescriptionValue(e.target.value)
                            }
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDialogCreateOpen(false);
                                setNameValue("");
                                setDescriptionValue("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (nameValue.trim()) {
                                    createGroup({
                                        name: nameValue.trim(),
                                        description: descriptionValue.trim(),
                                    });
                                    setDialogCreateOpen(false);
                                    setNameValue("");
                                    setDescriptionValue("");
                                }
                            }}
                            disabled={!nameValue.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Create Group
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
