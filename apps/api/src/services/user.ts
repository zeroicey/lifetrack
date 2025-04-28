import { eq } from "drizzle-orm";
import { db } from "@lifetrack/postgres-db";
import { users } from "@lifetrack/postgres-db";

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
