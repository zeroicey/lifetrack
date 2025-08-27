import type { Response } from "@/lib/http";
import http from "@/lib/http";
import type {
    Habit,
    HabitCreate,
    HabitLog,
    HabitLogCreate,
    HabitStats,
} from "@/types/habit";

export const apiCreateHabit = async (data: HabitCreate) => {
    const res = await http
        .post<Response<Habit>>("habits", {
            json: data,
        })
        .json();
    return res.data;
};

export const apiGetHabits = async () => {
    const res = await http.get<Response<HabitStats[]>>("habits").json();
    if (!res.data) return [];
    return res.data;
};

export const apiCreateHabitLog = async (data: HabitLogCreate) => {
    const res = await http
        .post<Response<HabitLog>>("habit-logs", {
            json: data,
        })
        .json();
    return res.data;
};

export const apiGetHabitLogs = async () => {
    const res = await http.get<Response<HabitLog[]>>(`habit-logs`).json();
    if (!res.data) return [];
    return res.data;
};

export const apiDeleteHabit = async (id: number) => {
    const res = await http.delete<Response<null>>(`habits/${id}`).json();
    return res.data;
};
