import { Hono } from "hono";
import { EventService } from "@/services/event";
import Responder from "@/middlewares/response";

export const EventRouter = new Hono();

const eventService = new EventService();

EventRouter.get("/events", async (c) => {
  const data = await eventService.getAllEvent();
  return Responder.success().setData(data).build(c);
});

EventRouter.get("/events/:id", async (c) => {
  const id = c.req.param("id");
  const data = await eventService.getEventById(Number(id));
  return Responder.success().setData(data).build(c);
});
