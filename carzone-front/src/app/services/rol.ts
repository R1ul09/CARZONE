import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Rol } from '../interfaces/rol.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles`, { headers: this.getHeaders() });
  }

  createRole(data: Partial<Rol>): Observable<Rol> {
    return this.http.post<Rol>(`${this.apiUrl}/roles`, data, { headers: this.getHeaders() });
  }

  updateRole(id: number, data: Partial<Rol>): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/roles/${id}`, data, { headers: this.getHeaders() });
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/roles/${id}`, { headers: this.getHeaders() });
  }
}
