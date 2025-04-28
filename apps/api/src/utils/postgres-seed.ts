import { reset, seed } from "drizzle-seed";

import { db } from "../db/postgres";
import { users } from "../schemas/postgres/user";
import { events } from "../schemas/postgres/event";
import { faker } from "@faker-js/faker";

// doc: https://orm.drizzle.team/docs/seed-overview
// @ts-ignore - temporary fix for drizzle-seed

const generateEventsValues = () => {
  let fakeEvents: string[] = [];
  for (let i = 0; i < 150; i++) {
    fakeEvents.push(faker.lorem.paragraphs());
  }
  return fakeEvents;
};

async function main() {
  await reset(db, { users, events });
  await seed(db, { users, events }).refine((f) => ({
    users: {
      count: 15,
    },
    events: {
      count: 150,
      columns: {
        content: f.valuesFromArray({
          values: generateEventsValues(),
        }),
      },
    },
  }));
}

main();
