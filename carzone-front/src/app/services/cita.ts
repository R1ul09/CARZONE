import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cita, CreateCita } from '../interfaces/cita.interface';

@Injectable({ providedIn: 'root' })
export class CitaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas`);
  }

  crearCita(data: CreateCita): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/citas`, data);
  }

  cancelarCita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/citas/${id}`);
  }

  getTodasLasCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas/todas`);
  }

  actualizarEstadoCita(id: number, estado: string): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/citas/${id}`, { estado });
  }

  actualizarMensaje(id: number, mensaje: string, estado?: string): Observable<Cita> {
    const body: any = { mensaje_empleado: mensaje };
    if (estado) body['estado'] = estado;
    return this.http.put<Cita>(`${this.apiUrl}/citas/${id}`, body);
  }
}