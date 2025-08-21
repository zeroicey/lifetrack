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
                <div key={event.id}>
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <p>{new Date(event.start_time).toLocaleString()}</p>
                    <p>{new Date(event.end_time).toLocaleString()}</p>
                    <p>{event.place}</p>
                </div>
            ))}
        </div>
    );
}
