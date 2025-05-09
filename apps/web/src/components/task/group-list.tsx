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

interface Props {
  currentGroup: number;
  setCurrentGroup: (id: number) => void;
}

export default function GroupList({ currentGroup, setCurrentGroup }: Props) {
  const [newGroupName, setNewGroupName] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { data: groups, isLoading } = useGroupQuery();
  const { mutate: createGroup } = useGroupMutation();

  const handleGroupClick = (id: number) => {
    setCurrentGroup(id);
  };

  return (
    <div className="w-32 p-2 flex flex-col justify-between gap-2 border">
      <ScrollArea className="overflow-y-auto">
        {groups?.map((group) => {
          const isActive = group.id === currentGroup;
          if (!isActive) {
            return (
              <div
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                className="relative cursor-pointer text-center text-sm p-1 mb-1 border truncate"
              >
                {group.name}
              </div>
            );
          }
          return (
            <div
              key={group.id}
              onClick={() => handleGroupClick(group.id)}
              className="relative cursor-pointer text-center text-sm p-1 mb-1 transition bg-blue-500 text-white font-semibold truncate"
            >
              {group.name}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Ellipsis className="absolute top-1 right-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => {
                      console.log("rename group", group.id);
                    }}
                  >
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      console.log("delete group", group.id);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </ScrollArea>

      <div className="text-center">
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
