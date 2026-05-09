import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../interfaces/marca.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  private apiUrl = (environment as any).environment?.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Método para traer todas las marcas
  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}/marcas`);
  }

  // Método para traer una marca por su ID
  getMarcaById(id: string | null): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/marcas/${id}`);
  }
}