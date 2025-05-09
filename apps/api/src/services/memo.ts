import { MemoCreate } from "@lifetrack/request-types";
import { desc } from "drizzle-orm";
import { db, memos } from "@lifetrack/postgres-db";

export class MemoService {
  public async getAllMemos() {
    const data = await db.select().from(memos).orderBy(desc(memos.createdAt));
    return data;
  }

  public async createMemo({ userId, content }: MemoCreate) {
    const data = await db.insert(memos).values({ userId, content }).returning();
    return data[0];
  }
}
