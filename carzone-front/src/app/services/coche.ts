import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Coche } from '../interfaces/coche.interface';
import { Observable } from 'rxjs';

export type CocheFiltro = 'todos' | 'disponibles' | 'reservados';
export type CocheOrden = 'precio_asc' | 'precio_desc' | 'anio_desc';

@Injectable({
  providedIn: 'root',
})

export class CocheService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para obtener todos los coches
  getTodosLosCoches(): Observable<Coche[]> {
    return this.http.get<Coche[]>(`${this.apiUrl}/coches`);
  }

  // Método para obtener coches destacados por IDs
  getCochesDestacados(ids: number[]): Observable<Coche[]> {
    const idsParam = ids.join(',');
    const url = `${this.apiUrl}/coches?ids=${idsParam}`;
    return this.http.get<Coche[]>(url);
  }

  // Método para el detalle de un coche
  getCocheById(id: number): Observable<Coche> {
    return this.http.get<Coche>(`${this.apiUrl}/coches/${id}`);
  }

  // Método para obtener coches por marca
  getCochesByMarca(marcaId: string | null): Observable<Coche[]> {
    return this.http.get<Coche[]>(`${this.apiUrl}/coches?marca_id=${marcaId}`);
  }

  // Método para obtener coches por marca por filtro y orden
  getCochesByMarcaConFiltros(marcaId: string | null, filtros: {
    disponible: number | null,
    tipo_carroceria: string,
    combustible: string,
    precio_max: string,
    orden: string
  }): Observable<Coche[]> {
    let params = new HttpParams().set('marca_id', marcaId || '');

    if (filtros.disponible !== null)      params = params.set('disponible', filtros.disponible);
    if (filtros.tipo_carroceria)          params = params.set('tipo_carroceria', filtros.tipo_carroceria);
    if (filtros.combustible)              params = params.set('combustible', filtros.combustible);
    if (filtros.precio_max)               params = params.set('precio_max', filtros.precio_max);
    if (filtros.orden)                    params = params.set('orden', filtros.orden);

    return this.http.get<Coche[]>(`${this.apiUrl}/coches`, { params });
  }
}
