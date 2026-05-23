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

  // Para FormData NO ponemos Content-Type, el navegador lo pone solo con el boundary
  private getHeadersFormData(): HttpHeaders {
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

  // ── IMÁGENES VEHÍCULOS ──
  // Subida con archivo real desde el ordenador
  addImagenCocheArchivo(cocheId: number, archivo: File, esPrincipal: boolean): Observable<any> {
    // formadata sirve para enviar archivos, el backend lo recibe como un archivo normal
    const formdata = new FormData();
    formdata.append('coche_id', String(cocheId));
    formdata.append('imagen', archivo);
    formdata.append('es_principal', esPrincipal ? '1' : '0');
    return this.http.post(`${this.apiUrl}/imagenes-vehiculos`, formdata, { headers: this.getHeadersFormData() });
  }

  // Subida con URL externa
  addImagenCocheUrl(cocheId: number, ruta: string, esPrincipal: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/imagenes-vehiculos`,
      { coche_id: cocheId, ruta, es_principal: esPrincipal },
      { headers: this.getHeaders() }
    );
  }

  deleteImagenCoche(imagenId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/imagenes-vehiculos/${imagenId}`, { headers: this.getHeaders() });
  }

  // ── MARCAS ────────────────────────────────────────────────
  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}/marcas`);
  }

  // Para crear/actualizar marcas usamos FormData si hay archivos, JSON si no
  createMarca(data: any, logoFile?: File, heroFile?: File): Observable<Marca> {
    const fd = this.buildMarcaFormData(data, logoFile, heroFile);
    return this.http.post<Marca>(`${this.apiUrl}/marcas`, fd, { headers: this.getHeadersFormData() });
  }

  updateMarca(id: number, data: any, logoFile?: File, heroFile?: File): Observable<Marca> {
    const formdata = this.buildMarcaFormData(data, logoFile, heroFile);
    // Laravel no soporta PUT con FormData → usamos POST con _method=PUT
    formdata.append('_method', 'PUT');
    return this.http.post<Marca>(`${this.apiUrl}/marcas/${id}`, formdata, { headers: this.getHeadersFormData() });
  }

  deleteMarca(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/marcas/${id}`, { headers: this.getHeaders() });
  }

  // metodo auxiliar para construir FormData para marcas, evitando repetir código en create/update
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
    return this.http.get<Cita[]>(`${this.apiUrl}/citas/todas`, { headers: this.getHeaders() });
  }

  actualizarCita(id: number, estado: string, mensaje?: string): Observable<Cita> {
    const body: any = { estado };
    if (mensaje !== undefined) body['mensaje_empleado'] = mensaje;
    return this.http.put<Cita>(`${this.apiUrl}/citas/${id}`, body, { headers: this.getHeaders() });
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