import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as environment from '../../environments/environment';
import { Coche } from '../interfaces/coche.interface';
import { Observable } from 'rxjs';

export type CocheFiltro = 'todos' | 'disponibles' | 'reservados';
export type CocheOrden = 'precio_asc' | 'precio_desc' | 'anio_desc';

@Injectable({
  providedIn: 'root',
})

export class CocheService {

  private apiUrl = (environment as any).environment?.apiUrl || 'http://localhost:8000/api';

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
}
