import {
  TaskCreate,
  TaskGroupCreate,
  TaskUpdate,
} from "@lifetrack/request-types";
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

  public async createGroup(userId: number, { name }: TaskGroupCreate) {
    const data = await db
      .insert(taskGroups)
      .values({ name, userId })
      .returning();
    return data[0];
  }

  public async deleteGroup(groupId: number) {
    await db.delete(taskGroups).where(eq(taskGroups.id, groupId));
  }

  public async updateGroup(groupId: number, name: string) {
    await db.update(taskGroups).set({ name }).where(eq(taskGroups.id, groupId));
  }

  public async createTask(data: TaskCreate) {
    const res = await db.insert(tasks).values(data).returning();
    return res[0];
  }

  public async deleteTask(taskId: number) {
    await db.delete(tasks).where(eq(tasks.id, taskId));
  }

  public async updateTask(data: TaskUpdate, taskId: number) {
    const res = await db
      .update(tasks)
      .set({ ...data })
      .where(eq(tasks.id, taskId))
      .returning();
    return res[0];
  }
}
