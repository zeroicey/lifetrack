import { Hono } from "hono";
import { UserService } from "../services/user";

export const UserRouter = new Hono();

const userService = new UserService();

UserRouter.get("/users", async (c) => {
  const data = await userService.getAllUsers();
  return c.json(data);
});

UserRouter.get("/users/:id", async (c) => {
  console.log("id", c.req.param("id"));
  const id = c.req.param("id");
  const data = await userService.getUserById(Number(id));
  return c.json(data);
});
