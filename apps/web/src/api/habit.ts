import type { Response } from "@/lib/http";
import http from "@/lib/http";
import type { Habit, HabitCreate, HabitStats } from "@/types/habit";

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
    console.log(res.data);
    if (!res.data) return [];
    return res.data;
};
