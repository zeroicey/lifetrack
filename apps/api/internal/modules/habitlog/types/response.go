package types

type HabitLogResponse struct {
	ID         int64  `json:"id"`
	HabitID    int64  `json:"habit_id"`
	HabitName  string `json:"habit_name"`
	HappenedAt string `json:"happened_at"`
}
