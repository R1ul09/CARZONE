import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // ── USUARIOS ──────────────────────────────────────────────
  getUsuarios(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/users`);
  }

  updateUsuario(id: number, data: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/users/${id}`, data);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  crearEmpleado(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/empleado`, data);
  }

  // ── COCHES ────────────────────────────────────────────────
  getCoches(): Observable<Coche[]> {
    return this.http.get<Coche[]>(`${this.apiUrl}/coches`);
  }

  createCoche(data: Partial<Coche>): Observable<Coche> {
    return this.http.post<Coche>(`${this.apiUrl}/coches`, data);
  }

  updateCoche(id: number, data: Partial<Coche>): Observable<Coche> {
    return this.http.put<Coche>(`${this.apiUrl}/coches/${id}`, data);
  }

  deleteCoche(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/coches/${id}`);
  }

  // ── IMÁGENES VEHÍCULOS ────────────────────────────────────
  addImagenCocheArchivo(cocheId: number, archivo: File, esPrincipal: boolean): Observable<any> {
    const formdata = new FormData();
    formdata.append('coche_id', String(cocheId));
    formdata.append('imagen', archivo);
    formdata.append('es_principal', esPrincipal ? '1' : '0');
    return this.http.post(`${this.apiUrl}/imagenes-vehiculos`, formdata);
  }

  addImagenCocheUrl(cocheId: number, ruta: string, esPrincipal: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/imagenes-vehiculos`, {
      coche_id: cocheId, ruta, es_principal: esPrincipal
    });
  }

  deleteImagenCoche(imagenId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/imagenes-vehiculos/${imagenId}`);
  }

  // ── MARCAS ────────────────────────────────────────────────
  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}/marcas`);
  }

  createMarca(data: any, logoFile?: File, heroFile?: File): Observable<Marca> {
    const fd = this.buildMarcaFormData(data, logoFile, heroFile);
    return this.http.post<Marca>(`${this.apiUrl}/marcas`, fd);
  }

  updateMarca(id: number, data: any, logoFile?: File, heroFile?: File): Observable<Marca> {
    const formdata = this.buildMarcaFormData(data, logoFile, heroFile);
    formdata.append('_method', 'PUT');
    return this.http.post<Marca>(`${this.apiUrl}/marcas/${id}`, formdata);
  }

  deleteMarca(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/marcas/${id}`);
  }

  private buildMarcaFormData(data: any, logoFile?: File, heroFile?: File): FormData {
    const formdata = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formdata.append(key, String(value));
    });
    if (logoFile) formdata.append('logo_file', logoFile);
    if (heroFile) formdata.append('imagen_hero_file', heroFile);
    return formdata;
  }

  // ── CITAS ─────────────────────────────────────────────────
  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas/todas`);
  }

  actualizarCita(id: number, estado: string, mensaje?: string): Observable<Cita> {
    const body: any = { estado };
    if (mensaje !== undefined) body['mensaje_empleado'] = mensaje;
    return this.http.put<Cita>(`${this.apiUrl}/citas/${id}`, body);
  }

  deleteCita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/citas/${id}`);
  }

  // ── SERVICIOS ─────────────────────────────────────────────
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios`);
  }

  createServicio(data: Partial<Servicio>): Observable<Servicio> {
    return this.http.post<Servicio>(`${this.apiUrl}/servicios`, data);
  }

  updateServicio(id: number, data: Partial<Servicio>): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/servicios/${id}`, data);
  }

  deleteServicio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/servicios/${id}`);
  }
}