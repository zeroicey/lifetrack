import { db } from "../db/postgres";
import { users, events } from "@lifetrack/db";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";

// 生成假的 events 内容
const generateEventsValues = () => {
  const fakeEvents: string[] = [];
  for (let i = 0; i < 150; i++) {
    fakeEvents.push(faker.lorem.paragraphs());
  }
  return fakeEvents;
};

async function main() {
  // 1. 清空表，并重置自增id
  await db.execute(sql`TRUNCATE TABLE events, users RESTART IDENTITY CASCADE`);

  // 2. 插入 users
  const insertedUsers = await db
    .insert(users)
    .values(
      Array.from({ length: 15 }).map(() => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        createdAt: faker.date.past({ years: 1 }), // 随机过去一年内的时间
      }))
    )
    .returning({ id: users.id });

  // 3. 插入 events
  const userIds = insertedUsers.map((u) => u.id);
  const fakeContents = generateEventsValues();

  await db.insert(events).values(
    fakeContents.map((content) => ({
      content,
      partyId: faker.helpers.arrayElement(userIds), // 随机挂到一个 user 上
      happenedAt: faker.date.recent({ days: 30 }), // 最近30天内
    }))
  );

  console.log("✅ Seeding completed!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
