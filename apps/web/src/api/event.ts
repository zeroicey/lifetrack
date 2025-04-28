import http from "@/lib/http";

export const getAllEvents = async () => {
  return http.get("event/events").json();
};
