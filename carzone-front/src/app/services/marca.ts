import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../interfaces/marca.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método para traer todas las marcas
  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}/marcas`);
  }

  // Método para traer una marca por su ID
  getMarcaById(id: string | null): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/marcas/${id}`);
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  createMarca(data: Partial<Marca>): Observable<Marca> {
    return this.http.post<Marca>(`${this.apiUrl}/marcas`, data, { headers: this.getHeaders() });
  }

  updateMarca(id: number, data: Partial<Marca>): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}/marcas/${id}`, data, { headers: this.getHeaders() });
  }

  deleteMarca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/marcas/${id}`, { headers: this.getHeaders() });
  }
}