import { Hono } from "hono";
import Responder from "@/middlewares/response";
import validater from "@/middlewares/validate";
import { z } from "zod";
import { LinkService } from "@/services/link";
import {
  linkCreateSchema,
  linkIdSchema,
  linkUpdateSchema,
} from "@lifetrack/request-types";

export const LinkRouter = new Hono<Env>();

const linkService = new LinkService();

LinkRouter.get("/links", async (c) => {
  const userId = c.var.userId;
  const data = await linkService.getAllLinks(userId);
  return Responder.success().setData(data).build(c);
});

LinkRouter.post("/links", validater("json", linkCreateSchema), async (c) => {
  const body = c.req.valid("json");
  const userId = c.var.userId;
  const data = await linkService.createLink(userId, body);
  return Responder.success("Link created successfully.")
    .setData(data)
    .setStatusCode(201)
    .build(c);
});

LinkRouter.delete(
  "/links/:id",
  validater("param", z.object({ id: linkIdSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    await linkService.deleteLink(id);
    return Responder.success("Link deleted successfully.")
      .setStatusCode(204)
      .build(c);
  }
);
LinkRouter.put(
  "/links/:id",
  validater("param", z.object({ id: linkIdSchema })),
  validater("json", linkUpdateSchema), // id is from param
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const data = await linkService.updateLink(id, body);
    return Responder.success("Link updated successfully.")
      .setData(data)
      .build(c);
  }
);
