export interface EventCreate {
  name: string;
  place: string;
  description: string;
  start_time: Date;
  end_time: Date;
  reminders?: number[]; // 提醒时间（分钟）
}

export interface Event extends EventCreate {
  id: string;
  created_at: Date;
  updated_at: Date;
}
