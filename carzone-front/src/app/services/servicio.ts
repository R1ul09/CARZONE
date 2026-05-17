import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Servicio } from '../interfaces/servicio.interface';

@Injectable({
  providedIn: 'root',
})

export class ServicioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método para traer todas las marcas
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios`);
  }
}
