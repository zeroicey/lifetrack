import { desc, eq } from "drizzle-orm";
import { db, links } from "@lifetrack/postgres-db";
import { LinkCreate, LinkUpdate } from "@lifetrack/request-types";

export class LinkService {
  public async getAllLinks(userId: number) {
    return await db
      .select()
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(desc(links.createdAt));
  }

  public async deleteLink(id: number) {
    await db.delete(links).where(eq(links.id, id));
  }

  public async createLink(userId: number, { name, target }: LinkCreate) {
    const data = await db
      .insert(links)
      .values({ userId, name, target })
      .returning();
    return data[0];
  }

  public async updateLink(id: number, { name, target }: LinkUpdate) {
    const data = await db
      .update(links)
      .set({ name, target, updatedAt: new Date() })
      .where(eq(links.id, id))
      .returning();
    return data[0];
  }
}
