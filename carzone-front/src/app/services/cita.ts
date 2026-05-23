import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cita, CreateCita } from '../interfaces/cita.interface';

@Injectable({ providedIn: 'root' })
export class CitaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas`, { headers: this.getHeaders() });
  }

  crearCita(data: CreateCita): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/citas`, data, { headers: this.getHeaders() });
  }

  cancelarCita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/citas/${id}`, { headers: this.getHeaders() });
  }

  getTodasLasCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas/todas`, { headers: this.getHeaders() });
  }

  actualizarEstadoCita(id: number, estado: string): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/citas/${id}`, { estado }, { headers: this.getHeaders() });
  }

  // solo empleado guarda un mensaje para el cliente (con o sin cambio de estado simultáneo)
  actualizarMensaje(id: number, mensaje: string, estado?: string): Observable<Cita> {
    const body: any = { mensaje_empleado: mensaje };
    if (estado) body['estado'] = estado;
    return this.http.put<Cita>(`${this.apiUrl}/citas/${id}`, body, { headers: this.getHeaders() });
  }
}