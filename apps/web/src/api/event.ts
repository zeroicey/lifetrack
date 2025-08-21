import type { Response } from "@/lib/http";
import http from "@/lib/http";
import type { Event, EventCreate } from "@/types/event";

export const apiCreateEvent = async (data: EventCreate) => {
    const res = await http
        .post<Response<Event>>("events", {
            json: data,
        })
        .json();
    console.log(res);
    return res.data;
};

export const apiGetEvents = async () => {
    const res = await http.get<Response<Event[]>>("events").json();
    console.log(res.data);
    if (!res.data) return [];
    return res.data;
};
