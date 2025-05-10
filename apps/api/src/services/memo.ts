import { MemoCreate } from "@lifetrack/request-types";
import { desc, lt } from "drizzle-orm";
import { db, memos } from "@lifetrack/postgres-db";

export class MemoService {
  public async getAllMemos(cursor?: number, limit: number = 10) {
    const data = await db
      .select()
      .from(memos)
      .where(cursor ? lt(memos.createdAt, new Date(cursor)) : undefined)
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

  public async createMemo({ userId, content }: MemoCreate) {
    const data = await db.insert(memos).values({ userId, content }).returning();
    return data[0];
  }
}
