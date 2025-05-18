import { Hono } from "hono";
import { TaskService } from "@/services/task";
import Responder from "@/middlewares/response";
import validater from "@/middlewares/validate";
import {
  taskCreateSchema,
  taskGroupCreateSchema,
} from "@lifetrack/request-types";

export const TaskRouter = new Hono<Env>();

const taskService = new TaskService();

TaskRouter.get("/groups", async (c) => {
  const userId = c.var.userId;
  const data = await taskService.getAllGroups(userId);
  return Responder.success().setData(data).build(c);
});

TaskRouter.get("/groups/:groupId/tasks", async (c) => {
  const groupId = c.req.param("groupId");
  const data = await taskService.getTasksByGroupId(Number(groupId));
  return Responder.success().setData(data).build(c);
});

TaskRouter.post(
  "/groups",
  validater("json", taskGroupCreateSchema),
  async (c) => {
    const body = c.req.valid("json");
    console.log(body);
    const data = await taskService.createGroup(body);
    return Responder.success().setData(data).build(c);
  }
);

TaskRouter.post("/tasks", validater("json", taskCreateSchema), async (c) => {
  console.log("create task");
  const body = c.req.valid("json");
  console.log(body);
  const data = await taskService.createTask(body);
  return Responder.success().setData(data).build(c);
});
