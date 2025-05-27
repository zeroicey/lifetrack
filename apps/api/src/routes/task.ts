import { z } from "zod";
import { Hono } from "hono";
import { TaskService } from "@/services/task";
import Responder from "@/middlewares/response";
import validater from "@/middlewares/validate";
import {
  commonNameSchema,
  taskCreateSchema,
  taskGroupCreateSchema,
  taskGroupIdSchema,
  taskIdSchema,
  taskUpdateSchema,
} from "@lifetrack/request-types";

export const TaskRouter = new Hono<Env>();

const taskService = new TaskService();

TaskRouter.post(
  "/groups",
  validater("json", taskGroupCreateSchema),
  async (c) => {
    const body = c.req.valid("json");
    const userId = c.var.userId;
    const data = await taskService.createGroup(userId, body);
    return Responder.success().setData(data).build(c);
  }
);

TaskRouter.delete(
  "/groups/:groupId",
  validater("param", z.object({ groupId: taskGroupIdSchema })),
  async (c) => {
    const { groupId } = c.req.valid("param");
    await taskService.deleteGroup(Number(groupId));
    return Responder.success("Group deleted successfully").build(c);
  }
);

TaskRouter.put(
  "/groups/:groupId",
  validater("json", z.object({ name: commonNameSchema })),
  validater("param", z.object({ groupId: taskGroupIdSchema })),
  async (c) => {
    const { groupId } = c.req.valid("param");
    const { name } = c.req.valid("json");
    await taskService.updateGroup(Number(groupId), name);
    return Responder.success("Group updated successfully").build(c);
  }
);

TaskRouter.get("/groups", async (c) => {
  const userId = c.var.userId;
  const data = await taskService.getAllGroups(userId);
  return Responder.success().setData(data).build(c);
});

TaskRouter.post("/tasks", validater("json", taskCreateSchema), async (c) => {
  const body = c.req.valid("json");
  const data = await taskService.createTask(body);
  return Responder.success("Task created successfully").setData(data).build(c);
});

TaskRouter.delete(
  "/tasks/:taskId",
  validater("param", z.object({ taskId: taskIdSchema })),
  async (c) => {
    const { taskId } = c.req.valid("param");
    await taskService.deleteTask(Number(taskId));
    return Responder.success("Task deleted successfully").build(c);
  }
);

TaskRouter.put(
  "/tasks/:taskId",
  validater("param", z.object({ taskId: taskIdSchema })),
  validater("json", taskUpdateSchema),
  async (c) => {
    const taskId = c.req.valid("param");
    const body = c.req.valid("json");
    const data = await taskService.updateTask(body, taskId);
    return Responder.success("Task updated successfully")
      .setData(data)
      .build(c);
  }
);

TaskRouter.get(
  "/groups/:groupId/tasks",
  validater("param", z.object({ groupId: taskGroupIdSchema })),
  async (c) => {
    const { groupId } = c.req.valid("param");
    const data = await taskService.getTasksByGroupId(Number(groupId));
    return Responder.success().setData(data).build(c);
  }
);
