import { Hono } from "hono";
import { UserRouter } from "@/routes/user";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import Responder from "@/middlewares/response";
import { TaskRouter } from "./routes/task";
import { MemoRouter } from "./routes/memo";
import { AuthRouter } from "./routes/auth";

const app = new Hono().basePath("api");

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(logger());

app.route("auth", AuthRouter);
app.route("user", UserRouter);
app.route("task", TaskRouter);
app.route("memo", MemoRouter);

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
