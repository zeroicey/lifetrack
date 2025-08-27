export interface HabitCreate {
    name: string;
    description: string;
}

export interface Habit {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface HabitStats extends Habit {
    total_logs: number;
    last_log_time?: string;
}

export interface HabitLogCreate {
    habit_id: number;
    happened_at: string;
}

export interface HabitLog {
    id: number;
    habit_id: number;
    habit_name: string;
    happened_at: string;
}
