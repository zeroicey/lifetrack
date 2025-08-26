export interface HabitCreate {
    name: string;
    description: string;
}

export interface Habit {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface HabitStats extends Habit {
    total_logs: number;
    last_log_time?: string;
}
