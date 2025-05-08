import { Hono } from "hono";
import { UserRouter } from "@/routes/user";
import { cors } from "hono/cors";
import Responder from "@/middlewares/response";
import { TaskRouter } from "./routes/task";

const app = new Hono().basePath("api");

app.use(cors());

app.route("user", UserRouter);
app.route("task", TaskRouter);

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
