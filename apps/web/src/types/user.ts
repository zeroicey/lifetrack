export interface RegisterBody {
    name: string;
    email: string;
    password: string;
    birthday: string;
    avatar_base64: string;
    bio: string;
}
export interface User {
    id: number;
    email: string;
    name: string;
    birthday: string;
    avatar_base64: string;
    bio: string;
    created_at: string;
    updated_at: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}
