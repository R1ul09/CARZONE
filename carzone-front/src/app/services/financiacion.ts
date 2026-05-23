import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Financiacion, CreateFinanciacion } from '../interfaces/financiacion.interface';

@Injectable({ providedIn: 'root' })
export class FinanciacionService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  solicitarFinanciacion(data: CreateFinanciacion): Observable<any> {
    return this.http.post(`${this.apiUrl}/financiaciones`, data, { headers: this.getHeaders() });
  }

  getFinanciaciones(): Observable<Financiacion[]> {
    return this.http.get<Financiacion[]>(`${this.apiUrl}/financiaciones`, { headers: this.getHeaders() });
  }

  eliminarFinanciacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/financiaciones/${id}`, { headers: this.getHeaders() });
  }
}