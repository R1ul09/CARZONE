export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role_id: number;
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}