import { Marca } from './marca.interface';

export interface ImagenVehiculo {
    id: number;
    ruta: string;
    es_principal: boolean;
}

export interface Coche {
    id: number;
    modelo: string;
    anio: number;
    precio: number;
    descripcion?: string;
    marca: Marca;
    imagen_principal?: ImagenVehiculo;
    imagenes?: ImagenVehiculo[];

    // Especificaciones técnicas
    potencia?: number;
    par_motor?: number;
    velocidad_max?: number;
    aceleracion?: number;

    // Configuración
    combustible?: string;
    transmision?: string;
    traccion?: string;
    num_plazas?: number;
    num_puertas?: number;

    // Estética y estado
    tipo_carroceria?: string;
    color?: string;
    disponible?: boolean;
    destacado?: boolean;
}