import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Coche } from '../interfaces/coche.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Coche {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para el catálogo de coches
  getCoches(): Observable<Coche[]> {
    return this.http.get<Coche[]>(this.apiUrl);
  }

  // Método para el detalle de un coche
  getCocheById(id: number): Observable<Coche> {
    return this.http.get<Coche>(`${this.apiUrl}/${id}`);
  }
}
