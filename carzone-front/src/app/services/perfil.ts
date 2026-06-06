import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PerfilService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPerfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${this.getUserId()}`, { withCredentials: true });
  }

  updatePerfil(data: { name: string, email: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, data, { withCredentials: true });
  }

  private getUserId(): number {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : 0;
  }
}