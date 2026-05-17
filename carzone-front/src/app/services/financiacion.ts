import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Financiacion, CreateFinanciacion } from '../interfaces/financiacion.interface';

@Injectable({
  providedIn: 'root'
})
export class FinanciacionService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para solicitar una financiación
  solicitarFinanciacion(data: CreateFinanciacion): Observable<any> {
    const token = localStorage.getItem('authToken');
    return this.http.post(`${this.apiUrl}/financiaciones`, data, {
      // bearer es el formato estándar para enviar tokens de autenticación en las cabeceras HTTP
        headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Método para obtener las financiaciones del usuario autenticado
  getFinanciaciones(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    return this.http.get<any[]>(`${this.apiUrl}/financiaciones`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteFinanciacion(id: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    return this.http.delete<void>(`${this.apiUrl}/financiaciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}