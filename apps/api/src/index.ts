import { Hono } from "hono";
import { UserRouter } from "@/routes/user";
import { EventRouter } from "@/routes/event";
import { cors } from "hono/cors";
import Responder from "@/middlewares/response";

const app = new Hono().basePath("api");

app.use(cors());

app.route("user", UserRouter);
app.route("event", EventRouter);

app.onError((err, c) => {
  return Responder.fail(err?.message).build(c);
});

app.notFound((c) => {
  return Responder.fail("Api not found").setStatusCode(404).build(c);
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
