export interface Marca {
    id: number;
    nombre: string;
    logo?: string;
}

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
}