import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as environment from '../../environments/environment';
import { Coche } from '../interfaces/coche.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CocheService {

  private apiUrl = (environment as any).environment?.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Método para obtener coches destacados por IDs
  getCochesDestacados(ids: number[]): Observable<Coche[]> {
    const idsParam = ids.join(',');
    const url = `${this.apiUrl}/coches?ids=${idsParam}`;
    console.log('Fetching from:', url);
    return this.http.get<Coche[]>(url);
  }

  // Método para el detalle de un coche
  getCocheById(id: number): Observable<Coche> {
    return this.http.get<Coche>(`${this.apiUrl}/${id}`);
  }
}
