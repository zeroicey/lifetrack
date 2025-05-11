import { Hono } from "hono";
import { UserService } from "../services/user";

export const UserRouter = new Hono();

const userService = new UserService();

UserRouter.get("/users", async (c) => {
  const data = await userService.getAllUsers();
  return c.json(data);
});
