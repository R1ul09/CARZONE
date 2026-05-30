import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Financiacion, CreateFinanciacion } from '../interfaces/financiacion.interface';

@Injectable({ providedIn: 'root' })
export class FinanciacionService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // El cliente solicita una financiación
  solicitarFinanciacion(data: CreateFinanciacion): Observable<any> {
    return this.http.post(`${this.apiUrl}/financiaciones`, data);
  }

  // El cliente ve sus propias financiaciones
  getFinanciaciones(): Observable<Financiacion[]> {
    return this.http.get<Financiacion[]>(`${this.apiUrl}/financiaciones`);
  }

  // El empleado/admin ve todas las financiaciones
  getTodasLasFinanciaciones(): Observable<Financiacion[]> {
    return this.http.get<Financiacion[]>(`${this.apiUrl}/financiaciones/todas`);
  }

  // El empleado/admin acepta o deniega una financiación
  responderFinanciacion(id: number, estado: 'aceptada' | 'denegada'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/financiaciones/${id}/responder`, { estado });
  }

  // El cliente o admin elimina una financiación
  eliminarFinanciacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/financiaciones/${id}`);
  }
}