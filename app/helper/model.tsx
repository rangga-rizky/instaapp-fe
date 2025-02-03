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

export interface Post {
    id: number;
    caption: string;
    image_url: string;
    user: User;
    likes_count: number;
    replies_count: number;
    replies: Reply[];
    is_liked_by_user: boolean;
    created_at: string;
    updated_at: string;
}


export interface PostsResponse {
    data: Post[];
    next_cursor: number;
}

export interface Reply {
    id: number;
    message: string;
    user: User;
    created_at: string;
    updated_at: string;
}

export interface ReplyRequest {
    post_id: number;
    message: string;
}

export interface RegisterResponse {
    data: User;
    access_token: string;
}

export interface LoginResponse {
    access_token: string;
}