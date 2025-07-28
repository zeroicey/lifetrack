import {
    useTaskGroupDeleteMutation,
    useTaskGroupUpdateMutation,
} from "@/hooks/use-task-group-query";
import { cn } from "@/lib/utils";
import type { TaskGroup } from "@/types/task";
import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
    group: TaskGroup;
    setCurrentTaskGroup: (taskGroup: TaskGroup) => void;
    currentTaskGroupId: number;
}

export default function TaskGroupItem({
    group,
    setCurrentTaskGroup,
    currentTaskGroupId,
}: Props) {
    const { mutate: updateTaskGroup } = useTaskGroupUpdateMutation();
    const { mutate: deleteTaskGroup } = useTaskGroupDeleteMutation();
    
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editName, setEditName] = useState(group.name);
    const [editDescription, setEditDescription] = useState(group.description || "");
    
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditName(group.name);
        setEditDescription(group.description || "");
        setShowEditDialog(true);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        deleteTaskGroup(group.id);
        setShowDeleteDialog(false);
    };

    const confirmEdit = () => {
        updateTaskGroup({
            id: group.id,
            name: editName.trim(),
            description: editDescription.trim()
        });
        setShowEditDialog(false);
    };

    return (
        <>
            <div
                key={group.id}
                onClick={() => setCurrentTaskGroup(group)}
                className={cn(
                    "group cursor-pointer text-sm p-3 rounded-lg border transition-all duration-200",
                    "flex items-center justify-between hover:shadow-sm",
                    currentTaskGroupId === group.id
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-card hover:bg-accent/50 border-border"
                )}
            >
                <span className="font-medium truncate flex-1">{group.name}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleEdit}
                        className="p-1 hover:bg-accent rounded transition-colors"
                        title="Edit Group"
                    >
                        <SquarePen className="h-3 w-3" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                        title="Delete Group"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Delete confirmation dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete Group</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete group "{group.name}"? This action cannot be undone and all tasks in this group will also be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Confirm Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit group dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Group</DialogTitle>
                        <DialogDescription>
                            Modify the group name and description
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Group Name</Label>
                            <Input
                                id="name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Enter group name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Group Description</Label>
                            <Textarea
                                id="description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Enter group description (optional)"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={confirmEdit} 
                                disabled={!editName.trim()}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
