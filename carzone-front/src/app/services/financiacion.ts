import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as environment from '../../environments/environment';
import { Observable } from 'rxjs';
import { FinanciacionRequest } from '../interfaces/financiacion.interface';

@Injectable({
  providedIn: 'root'
})
export class FinanciacionService {

  private apiUrl = (environment as any).environment?.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Método para solicitar una financiación
  solicitarFinanciacion(data: FinanciacionRequest): Observable<any> {
    const token = localStorage.getItem('authToken');
    return this.http.post(`${this.apiUrl}/financiaciones`, data, {
      // bearer es el formato estándar para enviar tokens de autenticación en las cabeceras HTTP
        headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Método para obtener las financiaciones del usuario autenticado
  getFinanciaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/financiaciones`);
  }
}