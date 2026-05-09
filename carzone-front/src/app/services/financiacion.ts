import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as environment from '../../environments/environment';
import { Observable } from 'rxjs';

export interface FinanciacionRequest {
  coche_id: number;
  meses: number;
  cuota_mensual: number;
  entrada: number;
  interes: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinanciacionService {

  private apiUrl = (environment as any).environment?.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  solicitarFinanciacion(data: FinanciacionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/financiaciones`, data);
  }
}