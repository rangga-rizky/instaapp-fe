export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface RegisterResponse {
    data: User;
    access_token: string;
}

export interface LoginResponse {
    access_token: string;
}