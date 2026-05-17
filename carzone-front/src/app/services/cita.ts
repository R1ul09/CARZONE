import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cita, CreateCita } from '../interfaces/cita.interface';

@Injectable({
  providedIn: 'root'
})

export class CitaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para devolver las cabeceras con el token de autenticación
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // metodo para obtener las citas del usuario autenticado
  getCitas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/citas`, {
      headers: this.getHeaders()
    });
  }

  // Método para crear una nueva cita
  crearCita(data: CreateCita): Observable<any> {
    return this.http.post(`${this.apiUrl}/citas`, data, {
      headers: this.getHeaders()
    });
  }

  // Método para cancelar una cita existente
  cancelarCita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/citas/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Método para obtener todas las citas (solo para empleados)
  getTodasLasCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas/todas`, {
      headers: this.getHeaders()
    });
  }

  // Método para actualizar el estado de una cita (solo para empleados)
  actualizarEstadoCita(id: number, estado: string): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/citas/${id}`, { estado }, {
      headers: this.getHeaders()
    });
  }
}