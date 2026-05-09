import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Servicio } from '../interfaces/servicio.interface';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  private apiUrl = (environment as any).environment?.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Método para traer todas las marcas
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios`);
  }
}
