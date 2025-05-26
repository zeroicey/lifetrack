import { Hono } from "hono";
import Responder from "@/middlewares/response";
import validater from "@/middlewares/validate";
import { z } from "zod";
import { LinkService } from "@/services/link";

export const LinkRouter = new Hono<Env>();

const linkService = new LinkService();

LinkRouter.get(
  "/title",
  validater(
    "query",
    z.object({
      url: z.string().url(),
    })
  ),
  async (c) => {
    const { url } = c.req.valid("query");
    const title = await linkService.requestTitle(url);
    // if (!title.length) return Responder.success().setData(title).build(c);
    return Responder.fail("Request failed").build(c);
  }
);
