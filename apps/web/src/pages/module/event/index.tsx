import { EventItem } from "@/components/event/event-item";
import { useEventQuery } from "@/hooks/use-event-query";

export default function EventPage() {
    const { data: events, isPending, isError } = useEventQuery();
    if (isPending) {
        return <p>Loading...</p>;
    }
    if (isError) {
        return <p>Error</p>;
    }
    if (!events) {
        return <p>No event found</p>;
    }
    return (
        <div>
            <h2>Event List</h2>
            {events.map((event) => (
                <EventItem key={event.id} event={event} />
            ))}
        </div>
    );
}
