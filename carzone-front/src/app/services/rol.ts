import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Rol } from '../interfaces/rol.interface';

@Injectable({ providedIn: 'root' })
export class RoleService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles`);
  }

  createRole(data: Partial<Rol>): Observable<Rol> {
    return this.http.post<Rol>(`${this.apiUrl}/roles`, data);
  }

  updateRole(id: number, data: Partial<Rol>): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/roles/${id}`, data);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/roles/${id}`);
  }
}