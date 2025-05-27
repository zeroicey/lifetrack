import { MemoCreate, MemoUpdate } from "@lifetrack/request-types";
import { and, desc, eq, lt } from "drizzle-orm";
import { db, memos } from "@lifetrack/postgres-db";

export class MemoService {
  public async getAllMemos(
    userId: number,
    cursor?: number,
    limit: number = 10
  ) {
    const whereCondition = [
      eq(memos.userId, userId),
      cursor ? lt(memos.createdAt, new Date(cursor)) : undefined,
    ].filter(Boolean);
    const data = await db
      .select()
      .from(memos)
      .where(and(...whereCondition))
      .orderBy(desc(memos.createdAt))
      .limit(limit + 1); // 多取一个判断是否还有下一页

    const hasNextPage = data.length > limit;
    const items = hasNextPage ? data.slice(0, limit) : data;
    const nextCursor = hasNextPage
      ? items[items.length - 1].createdAt.getTime()
      : null;

    return {
      items,
      nextCursor,
    };
  }

  public async deleteMemo(id: number) {
    await db.delete(memos).where(eq(memos.id, id));
  }

  public async createMemo(userId: number, { content }: MemoCreate) {
    const data = await db.insert(memos).values({ userId, content }).returning();
    return data[0];
  }

  public async updateMemo(userId: number, { id, content }: MemoUpdate) {
    const data = await db
      .update(memos)
      .set({ content, userId })
      .where(eq(memos.id, id))
      .returning();
    return data[0];
  }
}
