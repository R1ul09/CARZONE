import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Coche } from '../interfaces/coche.interface';
import { Marca } from '../interfaces/marca.interface';
import { Cita } from '../interfaces/cita.interface';
import { Servicio } from '../interfaces/servicio.interface';
import { Cliente } from '../interfaces/cliente.interface';

@Injectable({ providedIn: 'root' })

export class AdminService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ── USUARIOS ──────────────────────────────────────────────
  getUsuarios(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  updateUsuario(id: number, data: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/users/${id}`, data, { headers: this.getHeaders() });
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  // ── COCHES ────────────────────────────────────────────────
  getCoches(): Observable<Coche[]> {
    return this.http.get<Coche[]>(`${this.apiUrl}/coches`);
  }

  createCoche(data: Partial<Coche>): Observable<Coche> {
    return this.http.post<Coche>(`${this.apiUrl}/coches`, data, { headers: this.getHeaders() });
  }

  updateCoche(id: number, data: Partial<Coche>): Observable<Coche> {
    return this.http.put<Coche>(`${this.apiUrl}/coches/${id}`, data, { headers: this.getHeaders() });
  }

  deleteCoche(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/coches/${id}`, { headers: this.getHeaders() });
  }

  // Imágenes de vehículos
  addImagenCoche(cocheId: number, ruta: string, esPrincipal: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/imagenes-vehiculos`,
      { coche_id: cocheId, ruta, es_principal: esPrincipal },
      { headers: this.getHeaders() }
    );
  }

  // ── MARCAS ────────────────────────────────────────────────
  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}/marcas`);
  }

  createMarca(data: Partial<Marca>): Observable<Marca> {
    return this.http.post<Marca>(`${this.apiUrl}/marcas`, data, { headers: this.getHeaders() });
  }

  updateMarca(id: number, data: Partial<Marca>): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}/marcas/${id}`, data, { headers: this.getHeaders() });
  }

  deleteMarca(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/marcas/${id}`, { headers: this.getHeaders() });
  }

  // ── CITAS ─────────────────────────────────────────────────
  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas/todas`, { headers: this.getHeaders() });
  }

  actualizarCita(id: number, estado: string): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/citas/${id}`, { estado }, { headers: this.getHeaders() });
  }

  deleteCita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/citas/${id}`, { headers: this.getHeaders() });
  }

  // ── SERVICIOS ─────────────────────────────────────────────
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios`);
  }

  createServicio(data: Partial<Servicio>): Observable<Servicio> {
    return this.http.post<Servicio>(`${this.apiUrl}/servicios`, data, { headers: this.getHeaders() });
  }

  updateServicio(id: number, data: Partial<Servicio>): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/servicios/${id}`, data, { headers: this.getHeaders() });
  }

  deleteServicio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/servicios/${id}`, { headers: this.getHeaders() });
  }
}