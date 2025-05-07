import { Hono } from "hono";
import { TaskService } from "@/services/task";
import Responder from "@/middlewares/response";
import validater from "@/middlewares/validate";
import { taskGroupCreateSchema } from "@lifetrack/request-types";

export const TaskRouter = new Hono();

const taskService = new TaskService();

TaskRouter.get("/groups", async (c) => {
  const data = await taskService.getAllGroups();
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
