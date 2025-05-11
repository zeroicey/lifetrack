import { eq } from "drizzle-orm";
import { db } from "@lifetrack/postgres-db";
import { users } from "@lifetrack/postgres-db";
import { UserCreate } from "@lifetrack/request-types";

export class UserService {
  public async getAllUsers() {
    const data = await db.select().from(users);
    return data;
  }

  public async getUserByName(name: string) {
    const data = await db
      .select()
      .from(users)
      .where(eq(users.username, name))
      .limit(1);
    return data[0];
  }

  public async getUserByEmail(email: string) {
    const data = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return data[0];
  }

  public async createUser(user: UserCreate) {
    user.password = await Bun.password.hash(user.password);
    await db.insert(users).values(user);
  }

  public async verifyPassword(password: string, hash: string) {
    return await Bun.password.verify(password, hash);
  }
}
