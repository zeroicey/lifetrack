import { eq } from "drizzle-orm";
import { db } from "../db/postgres";
import { events } from "@lifetrack/db";
import { EventCreate } from "@lifetrack/request-types";

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

  public async createEvent({ content, partyId }: EventCreate) {
    console.log("createEvent", content, partyId);
    const data = await db
      .insert(events)
      .values({ content, partyId })
      .returning();
    return data[0];
  }
}
