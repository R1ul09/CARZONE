import { Rol } from './rol.interface';

export interface Cliente {
    id: number;
    name: string;
    email: string;
    role_id: number;
    role?: Rol;
}