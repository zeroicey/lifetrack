"use client";
import { DateTimePicker24h } from "@/components/ui/time-picker";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";

export default function TaskPage() {
  return (
    <div className="flex h-screen w-screen items-center flex-col p-2">
      <h1>Task</h1>
      <div className="flex items-center justify-center gap-2 w-1/2">
        <span>content: </span>
        <Input type="text" placeholder="Type here..." className="w-full" />
      </div>

      <div className="flex w-1/2 items-center justify-center gap-2">
        <span>Deadline: </span>
        <DateTimePicker24h />
      </div>
      <Button className="w-1/2" variant="outline">
        Submit
      </Button>
      <div></div>
    </div>
  );
}
