import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../interfaces/marca.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MarcaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}/marcas`);
  }

  getMarcaById(id: string | null): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/marcas/${id}`);
  }

  createMarca(data: Partial<Marca>): Observable<Marca> {
    return this.http.post<Marca>(`${this.apiUrl}/marcas`, data);
  }

  updateMarca(id: number, data: Partial<Marca>): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}/marcas/${id}`, data);
  }

  deleteMarca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/marcas/${id}`);
  }
}