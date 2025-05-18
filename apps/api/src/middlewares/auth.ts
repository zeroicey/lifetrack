import { Context, Next } from "hono";
import Responder from "./response";
import { verifyToken } from "@/utils/jwt";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return Responder.fail("Unauthorized").setStatusCode(401).build(c);

  const { res, sub } = await verifyToken(token);
  if (!res) return Responder.fail("Invalid token").setStatusCode(401).build(c);
  c.set("userId", Number(sub));

  await next();
};
