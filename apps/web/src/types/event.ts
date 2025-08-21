export interface EventCreate {
  name: string;
  place: string;
  description: string;
  start_time: Date;
  end_time: Date;
  reminders?: number[]; // 提醒时间（分钟）
}

export interface Event extends Omit<EventCreate, 'reminders'> {
  id: string;
  created_at: Date;
  updated_at: Date;
  reminders?: EventReminder[]; // 完整的提醒对象数组
}

export interface EventReminder {
    id: number;
    event_id: number;
    remind_before: number; // 提醒前的分钟数
    notified: boolean;
    created_at: Date;
}
