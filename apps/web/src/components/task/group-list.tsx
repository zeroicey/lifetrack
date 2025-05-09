"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { useGroupMutation, useGroupQuery } from "@/hook/useTaskQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Props {
  currentGroup: number;
  setCurrentGroup: (id: number) => void;
}

export default function GroupList({ currentGroup, setCurrentGroup }: Props) {
  const [newGroupName, setNewGroupName] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { data: groups } = useGroupQuery();
  const { mutate: createGroup } = useGroupMutation();

  const handleGroupClick = (id: number) => {
    setCurrentGroup(id);
  };

  return (
    <div className="w-32 flex flex-col justify-between gap-2">
      <div className="overflow-y-auto">
        {groups?.map((group) => {
          return (
            <div
              key={group.id}
              onClick={() => handleGroupClick(group.id)}
              className={cn(
                "relative cursor-pointer text-center text-sm p-1 mb-1 border truncate",
                currentGroup === group.id ? "bg-gray-200" : "hover:bg-gray-100"
              )}
            >
              {group.name}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 flex-col">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Edit Group</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                console.log("rename group", currentGroup);
              }}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                console.log("delete group", currentGroup);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">New Group</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a new group</DialogTitle>
              <DialogDescription>
                Add a new group to save your tasks in.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-5 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newGroupName}
                  className="col-span-3"
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    createGroup({ name: newGroupName, userId: 1 });
                    setDialogOpen(false);
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
