import { eq } from "drizzle-orm";
import { db } from "../db/postgres";
import { users } from "@lifetrack/db";

export class UserService {
  public async getAllUsers() {
    const data = await db.select().from(users);
    return data;
  }

  public async getUserById(id: number) {
    const data = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return data[0];
  }
}
