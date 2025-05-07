import { TaskCreate } from "@lifetrack/request-types";
import { eq } from "drizzle-orm";
import { db, tasks } from "@lifetrack/postgres-db";
import { taskGroups } from "@lifetrack/postgres-db";

export class TaskService {
  public async getAllGroups() {
    const data = await db
      .select()
      .from(taskGroups)
      .orderBy(taskGroups.createdAt);
    return data;
  }

  public async getTasksByGroupId(groupId: number) {
    const data = await db
      .select()
      .from(tasks)
      .where(eq(tasks.groupId, groupId));
    return data;
  }

  public async createGroup({ name, userId }: TaskCreate) {
    const data = await db
      .insert(taskGroups)
      .values({ name, userId })
      .returning();
    return data[0];
  }
}
