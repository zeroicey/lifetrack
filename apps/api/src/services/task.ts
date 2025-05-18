import { TaskCreate, TaskGroupCreate } from "@lifetrack/request-types";
import { desc, eq } from "drizzle-orm";
import { db, tasks } from "@lifetrack/postgres-db";
import { taskGroups } from "@lifetrack/postgres-db";

export class TaskService {
  public async getAllGroups(userId: number) {
    const data = await db
      .select()
      .from(taskGroups)
      .where(eq(taskGroups.userId, userId))
      .orderBy(desc(taskGroups.createdAt));
    return data;
  }

  public async getTasksByGroupId(groupId: number) {
    const data = await db
      .select()
      .from(tasks)
      .where(eq(tasks.groupId, groupId));
    return data;
  }

  public async createGroup({ name, userId }: TaskGroupCreate) {
    const data = await db
      .insert(taskGroups)
      .values({ name, userId })
      .returning();
    return data[0];
  }

  public async createTask({ content, groupId, deadline }: TaskCreate) {
    const data = await db
      .insert(tasks)
      .values({ content, groupId, deadline })
      .returning();
    return data[0];
  }
}
