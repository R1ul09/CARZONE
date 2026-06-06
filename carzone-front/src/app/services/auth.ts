import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role_id: number;
  email_verified_at: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  email_verified: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class Auth {

  private apiUrl = environment.apiUrl;

  // Signal reactivo: el resto de la app puede leer el usuario actual
  readonly user = signal<AuthUser | null>(this.usuarioGuardado());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // CSRF
  // Sanctum SPA requiere obtener el cookie CSRF antes de cualquier mutación.
  // La URL /sanctum/csrf-cookie es fija de Laravel Sanctum.
  getCsrfCookie(): Observable<void> {
    return this.http.get<void>('/sanctum/csrf-cookie', { 
      withCredentials: true,
      headers: { 'Accept': 'application/json' }
    });
  }

  // REGISTRO
  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.getCsrfCookie().pipe(
      switchMap(() => this.doRegister(name, email, password))
    );
  }

  doRegister(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      { name, email, password, password_confirmation: password },
      { 
        withCredentials: true,
        headers: { 'Accept': 'application/json' }
      }
    ).pipe(
      tap(res => {
        this.user.set(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  // LOGIN
  doLogin(email: string, password: string): Observable<AuthResponse> {
    return this.getCsrfCookie().pipe(
      switchMap(() =>
        this.http.post<AuthResponse>(
          `${this.apiUrl}/login`,
          { email, password },
          { 
            withCredentials: true,
            headers: { 'Accept': 'application/json' }
          }
        )
      ),
      tap(res => {
        this.user.set(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  // LOGOUT
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { 
      withCredentials: true,
      headers: { 'Accept': 'application/json' }
    }).pipe(
      tap({
        next: () => this.limpiarSesion(),
        error: () => {
          this.limpiarSesion();
        }
      })
    );
  }

  // VERIFICACIÓN DE EMAIL
  reenviarVerificacion(): Observable<any> {
    return this.http.post(`${this.apiUrl}/email/verification-notification`, {}, { withCredentials: true });
  }

  // RECUPERAR CONTRASEÑA
  forgotPassword(email: string): Observable<{ status: string }> {
    return this.getCsrfCookie().pipe(
      switchMap(() => 
        this.http.post<{ status: string }>(
          `${this.apiUrl}/forgot-password`,
          { email },
          { 
            withCredentials: true,
            headers: { 'Accept': 'application/json' }
          }
        )
      )
    );
  }

  resetPassword(token: string, email: string, password: string): Observable<{ status: string }> {
    return this.getCsrfCookie().pipe(
      switchMap(() => 
        this.http.post<{ status: string }>(
          `${this.apiUrl}/reset-password`,
          { token, email, password, password_confirmation: password },
          { 
            withCredentials: true,
            headers: { 'Accept': 'application/json' }
          }
        )
      )
    );
  }

  // Redirige al backend, que redirige a Google
  loginConGoogle(): void {
    // Guardamos la ruta actual para poder volver después si quisiéramos
    window.location.href = '/auth/google/redirect';
  }

  // HELPERS
  estaLogueado(): boolean {
    return this.user() !== null;
  }

  emailVerificado(): boolean {
    return this.user()?.email_verified_at !== null;
  }

  private limpiarSesion(): void {
    this.user.set(null);
    localStorage.removeItem('user');
  }

  private usuarioGuardado(): AuthUser | null {
    const str = localStorage.getItem('user');
    if (!str) return null;
    try { return JSON.parse(str); } catch { return null; }
  }
}