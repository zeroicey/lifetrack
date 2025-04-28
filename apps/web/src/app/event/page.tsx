"use client";
import { useEffect, useState } from "react";
import { event } from "@lifetrack/response-types";
import { getAllEvents } from "@/api/event";

export default function EventPage() {
  const [events, setEvents] = useState<event.EventSelect[]>([]);
  useEffect(() => {
    getAllEvents()
      .then((data) => {
        setEvents(data.data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      {events.map((event) => {
        return (
          <div key={event.id} className="border rounded m-2 p-2">
            {JSON.stringify(event.content)}
          </div>
        );
      })}
    </div>
  );
}
