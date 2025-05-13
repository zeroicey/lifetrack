import { Hono } from "hono";
import { UserService } from "../services/user";

export const UserRouter = new Hono();

const userService = new UserService();

UserRouter.get("/users", async (c) => {
  const cookie = c.req.header("Cookie") || "";
  const refreshToken = cookie.match(/refresh_token=([^;]+)/)?.[1];
  console.log("refreshToken", refreshToken);
  const data = await userService.getAllUsers();
  return c.json(data);
});
