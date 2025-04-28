import { eq } from "drizzle-orm";
import { db } from "../db/postgres";
import { event } from "@lifetrack/db";

const { events } = event;

export class EventService {
  public async getAllEvent() {
    const data = await db.select().from(events);
    return data;
  }

  public async getEventById(id: number) {
    const data = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);
    return data[0];
  }
}
