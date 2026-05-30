import { CitaCoche } from './cita.interface';

// Usuario simplificado que viene en la respuesta de la API
export interface FinanciacionUser {
    id: number;
    name: string;
    email: string;
}

export interface Financiacion {
    id: number;
    user_id: number;
    coche_id: number;
    meses: number;
    cuota_mensual: number;
    entrada?: number;
    interes?: number;
    estado: 'pendiente' | 'aceptada' | 'denegada';
    user?: FinanciacionUser;
    coche?: CitaCoche;
}

export interface CreateFinanciacion {
    coche_id: number;
    meses: number;
    cuota_mensual: number;
    entrada?: number;
    interes?: number;
}