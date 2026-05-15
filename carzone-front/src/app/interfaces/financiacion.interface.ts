import { CitaCoche } from './cita.interface';

export interface Financiacion {
    id: number;
    user_id: number;
    coche_id: number;
    meses: number;
    cuota_mensual: number;
    entrada?: number;
    interes?: number;
    coche?: CitaCoche;
}

export interface CreateFinanciacion {
    coche_id: number;
    meses: number;
    cuota_mensual: number;
    entrada?: number;
    interes?: number;
}