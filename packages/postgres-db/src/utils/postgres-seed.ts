import { db } from "../driver";
import { taskGroups, tasks } from "../schema/task";
import { users } from "../schema/user";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";

const taskGroupNames = [
  "工作",
  "学习",
  "生活",
  "娱乐",
  "运动",
  "旅行",
  "社交",
  "购物",
  "阅读",
  "音乐",
];

// 生成假的 events 内容
const generateEventsValues = () => {
  const fakeEvents: string[] = [];
  for (let i = 0; i < 150; i++) {
    fakeEvents.push(faker.lorem.paragraphs());
  }
  return fakeEvents;
};

const generateTasksValues = () => {
  const fakeTasks: string[] = [];
  for (let i = 0; i < 150; i++) {
    fakeTasks.push(faker.lorem.sentences());
  }
  return fakeTasks;
};

async function main() {
  // 1. 清空表，并重置自增id
  await db.execute(
    sql`TRUNCATE TABLE users, tasks, task_groups RESTART IDENTITY CASCADE`
  );

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

  const userIds = insertedUsers.map((u) => u.id);
  // 4. 插入 taskGroups
  const insertedTaskGroups = await db
    .insert(taskGroups)
    .values(
      taskGroupNames.map((name) => ({
        name,
        userId: faker.helpers.arrayElement(userIds), // 随机挂到一个 user 上
        updatedAt: faker.date.past({ years: 1 }), // 随机过去一年内的时间
        createdAt: faker.date.past({ years: 1 }), // 随机过去一年内的时间
      }))
    )
    .returning({ id: taskGroups.id });

  const taskGroupIds = insertedTaskGroups.map((u) => u.id);

  // 5. 插入 tasks
  await db.insert(tasks).values(
    generateTasksValues().map((content) => ({
      content,
      groupId: faker.helpers.arrayElement(taskGroupIds), // 随机挂到一个 user 上
      deadline: faker.date.recent({ days: 30 }), // 最近30天内
      state: faker.helpers.arrayElement(["TODO", "DONE"]),
      createdAt: faker.date.past({ years: 1 }), // 随机过去一年内的时间
    }))
  );

  console.log("✅ Seeding completed!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
