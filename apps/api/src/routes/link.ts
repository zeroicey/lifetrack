import { Hono } from "hono";
import Responder from "@/middlewares/response";
import validater from "@/middlewares/validate";
import { z } from "zod";
import { LinkService } from "@/services/link";

export const LinkRouter = new Hono<Env>();

const linkService = new LinkService();
