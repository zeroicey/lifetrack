import Responder from "@/middlewares/response";
import validater from "@/middlewares/validate";
import { UserService } from "@/services/user";
import { signAccessToken, verifyAccessToken } from "@/utils/jwt";
import { UserCreate, userCreateSchema } from "@lifetrack/request-types";
import { Hono } from "hono";
import { z } from "zod";

export const AuthRouter = new Hono();

const userService = new UserService();

AuthRouter.post(
  "/login",
  validater(
    "json",
    z.object({
      nameOrEmail: z.string().min(1, "Name or email is required"),
      password: z.string().min(1, "Password is required"),
    })
  ),
  async (c) => {
    const userLogin = c.req.valid("json");

    const user = z.string().email().safeParse(userLogin.nameOrEmail).success
      ? await userService.getUserByEmail(userLogin.nameOrEmail)
      : await userService.getUserByName(userLogin.nameOrEmail);

    if (
      !user ||
      !userService.verifyPassword(userLogin.password, user.password)
    ) {
      return Responder.fail("Invalid credentials").build(c);
    }

    const accessToken = await signAccessToken({ sub: user.username });
    const refreshToken = await signAccessToken({ sub: user.username });

    c.header(
      "Set-Cookie",
      `refresh_token=${refreshToken}; HttpOnly; Path=/auth/refresh; SameSite=Strict`
    );
    return Responder.success("Login successfully")
      .setData({ accessToken })
      .build(c);
  }
);

AuthRouter.post("/register", validater("json", userCreateSchema), async (c) => {
  const user: UserCreate = c.req.valid("json");
  userService.createUser(user);
  return Responder.success("Register successfully").build(c);
});

AuthRouter.post("/logout", async (c) => {
  return Responder.success("Logout success").build(c);
});

AuthRouter.post("/refresh-token", async (c) => {
  const cookie = c.req.header("Cookie") || "";
  const refreshToken = cookie.match(/refresh_token=([^;]+)/)?.[1];

  if (!refreshToken) return c.text("No refresh token", 401);

  try {
    const { payload } = await verifyAccessToken(refreshToken);
    const accessToken = await signAccessToken({ sub: payload.sub! });
    return Responder.success("Login successfully")
      .setData({ accessToken })
      .build(c);
  } catch {
    return Responder.fail("Invalid refresh token").setStatusCode(401).build(c);
  }
});
