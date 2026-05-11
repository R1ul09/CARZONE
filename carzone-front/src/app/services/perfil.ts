import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private apiUrl = (environment as any).environment?.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Método para obtener las cabeceras con el token de autenticación
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Método para obtener el perfil del usuario autenticado
  getPerfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${this.getUserId()}`, {
      headers: this.getHeaders()
    });
  }

  // Método para actualizar el perfil del usuario autenticado
  updatePerfil(data: { name: string, email: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${this.getUserId()}`, data, {
      headers: this.getHeaders()
    });
  }

  // Método para obtener el ID del usuario autenticado desde el localStorage
  private getUserId(): number {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : 0;
  }
}