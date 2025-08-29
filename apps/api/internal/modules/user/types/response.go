package types

type UserResponse struct {
	ID           int64  `json:"id"`
	Email        string `json:"email"`
	Name         string `json:"name"`
	Birthday     string `json:"birthday"`
	AvatarBase64 string `json:"avatar_base64"`
	Bio          string `json:"bio"`
	CreatedAt    string `json:"created_at"`
	UpdatedAt    string `json:"updated_at"`
}

type UserExistsResponse struct {
	Exists bool `json:"exists"`
}

type LoginResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}
