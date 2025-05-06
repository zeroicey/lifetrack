"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateEventMutation, useEventQuery } from "@/hook/useEventQuery";
import { EventSelect } from "@lifetrack/response-types";
import { format } from "date-fns";
import React, { useState } from "react";

export default function EventPage() {
  const [eventContent, setEventContent] = useState("");
  const { data, isLoading } = useEventQuery();
  const { mutate: createMutate } = useCreateEventMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center flex-col p-2">
        <h1 className="text-2xl font-bold text-center">Event List</h1>
        <Input
          type="text"
          value={eventContent}
          onChange={(e) => setEventContent(e.target.value)}
        />
        <Button
          className="w-1/2"
          variant="outline"
          onClick={() => {
            createMutate({
              content: eventContent,
              partyId: 1,
            });
            setEventContent("");
          }}
        >
          Submit
        </Button>
      </div>
      <div>
        {data?.map((event: EventSelect) => (
          <div key={event.id} className="border p-4 m-2 rounded-md shadow-md">
            <div className="flex items-center justify-between">
              <span>{event.partyId}</span>
              <span>{format(event.happenedAt, "yyyy-MM-dd HH:mm:ss")}</span>
            </div>
            <div>{event.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
