import { Hono } from "hono";
import { UserRouter } from "@/routes/user";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import Responder from "@/middlewares/response";
import { TaskRouter } from "./routes/task";
import { MemoRouter } from "./routes/memo";
import { AuthRouter } from "./routes/auth";
import { authMiddleware } from "./middlewares/auth";
import { LinkRouter } from "./routes/link";

const app = new Hono<Env>().basePath("api");

app.use(cors());
app.use(logger());

app.route("auth", AuthRouter);

app.use(authMiddleware);

app.route("user", UserRouter);
app.route("task", TaskRouter);
app.route("memo", MemoRouter);
app.route("link", LinkRouter);

app.onError((err, c) => {
  console.log(err);
  return Responder.fail(err?.message).build(c);
});

app.notFound((c) => {
  return Responder.fail("Api not found").setStatusCode(404).build(c);
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
