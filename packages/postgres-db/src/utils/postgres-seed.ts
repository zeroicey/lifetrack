import { db } from "../driver";
import { memos } from "../schema/memo";
import { taskGroups, tasks } from "../schema/task";
import { users } from "../schema/user";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";

const taskGroupNames = [
  "Work",
  "Learn",
  "Life",
  "Entertainment",
  "Health",
  "Sports",
  "Social",
  "Shopping",
  "Reading",
  "Music",
];

// 生成 150 条任务内容
const generateTasksValues = () => {
  const fakeTasks: string[] = [];
  for (let i = 0; i < 150; i++) {
    fakeTasks.push(faker.lorem.words());
  }
  return fakeTasks;
};

const generateMemosValues = () => {
  const fakeMemos: string[] = [];
  for (let i = 0; i < 150; i++) {
    fakeMemos.push(faker.lorem.paragraph());
  }
  return fakeMemos;
};

async function main() {
  // clean up the database
  await db.execute(
    sql`TRUNCATE TABLE users, tasks, task_groups RESTART IDENTITY CASCADE`
  );

  // insert users
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

  // insert task groups
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

  // insert tasks
  await db.insert(tasks).values(
    generateTasksValues().map((content) => ({
      content,
      groupId: faker.helpers.arrayElement(taskGroupIds), // 随机挂到一个 user 上
      deadline: faker.date.recent({ days: 30 }), // 最近30天内
      state: faker.helpers.arrayElement(["TODO", "DONE"]),
      createdAt: faker.date.past({ years: 1 }), // 随机过去一年内的时间
    }))
  );

  // insert memos
  await db.insert(memos).values(
    generateMemosValues().map((content) => ({
      content,
      userId: faker.helpers.arrayElement(userIds), // 随机挂到一个 user 上
      createdAt: faker.date.past({ years: 1 }), // 随机过去一年内的时间
      updatedAt: faker.date.past({ years: 1 }), // 随机过去一年内的时间
    }))
  );

  console.log("✅ Seeding completed!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
