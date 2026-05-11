import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as environment from '../../environments/environment';
import { LoginResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})

export class Auth {

  private apiUrl = (environment as any).environment?.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // metodo login para enviar las credenciales al backend
  login(email: string, password: string): Observable<LoginResponse> {
    // tenemos que enviar una petición POST al backend a su endpoint correspondiente
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  // metodo register para enviar las credenciales al backend
  register(name: string, email: string, password: string): Observable<LoginResponse> {
    // tenemos que enviar una petición POST al backend a su endpoint correspondiente
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, { name, email, password });
  }

  // metodo logout para cerrar sesión
  logout(): Observable<void> {
    const token = localStorage.getItem('authToken');
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
  }
}
