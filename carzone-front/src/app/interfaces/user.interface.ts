import { Rol } from './rol.interface';

export interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    role?: Rol;
}

export interface CreateUser {
    name: string;
    email: string;
    password: string;
    role_id: number;
}

export interface UpdateUser {
    name?: string;
    email?: string;
    password?: string;
    role_id?: number;
}