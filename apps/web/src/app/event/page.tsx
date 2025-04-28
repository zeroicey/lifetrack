"use client";
import { getAllEvents } from "@/api/event";
import { EventSelect } from "@lifetrack/response-types";
import { useEffect, useState } from "react";

export default function EventPage() {
  const [events, setEvents] = useState<EventSelect[]>([]);
  useEffect(() => {
    getAllEvents().then((data) => {
      setEvents(data || []);
    });
  }, []);
  return (
    <div>
      {events.map((event) => (
        <div key={event.id} className="border p-4 m-2 rounded-md shadow-md">
          <h2>{event.content}</h2>
          <p>{event.partyId}</p>
        </div>
      ))}
    </div>
  );
}
