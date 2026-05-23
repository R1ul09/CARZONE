import { Marca } from './marca.interface';
import { ImagenVehiculo } from './coche.interface';

export interface Servicio {
    id: number;
    nombre: string;
    descripcion?: string;
    precio?: number;
}

export interface CitaCoche {
    id: number;
    modelo: string;
    marca?: Marca;
    imagen_principal?: ImagenVehiculo;
}

export interface Cita {
    id: number;
    user_id: number;
    servicio_id: number;
    coche_id?: number;
    fecha: string;
    hora: string;
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'realizada' | 'hora_ocupada';
    mensaje_empleado?: string | null;
    servicio?: Servicio;
    coche?: CitaCoche;
    user?: { id: number; name: string; email: string; };
}

export interface CreateCita {
    servicio_id: number;
    coche_id?: number;
    fecha: string;
    hora: string;
}