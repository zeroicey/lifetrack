package types

type CreateHabitBody struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type UpdateHabitBody struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}