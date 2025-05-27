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

  public async updateLink({ id: linkId, name, target }: LinkUpdate) {
    const valuesToUpdate: Partial<{
      name: string;
      target: string;
      updatedAt: Date;
    }> = {};
    if (name) {
      valuesToUpdate.name = name;
    }
    if (target) {
      valuesToUpdate.target = target;
    }
    valuesToUpdate.updatedAt = new Date();

    const data = await db
      .update(links)
      .set(valuesToUpdate)
      .where(eq(links.id, linkId))
      .returning();
    return data[0];
  }
}
