import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Servicio } from '../interfaces/servicio.interface';

@Injectable({
  providedIn: 'root',
})

export class ServicioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Método para traer todas las marcas
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios`);
  }

  createServicio(data: Partial<Servicio>): Observable<Servicio> {
    return this.http.post<Servicio>(`${this.apiUrl}/servicios`, data, { headers: this.getHeaders() });
  }

  updateServicio(id: number, data: Partial<Servicio>): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/servicios/${id}`, data, { headers: this.getHeaders() });
  }

  deleteServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/servicios/${id}`, { headers: this.getHeaders() });
  }
}
