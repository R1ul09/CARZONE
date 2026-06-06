import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../services/auth';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-oauth-callback',
    standalone: true,
    template: `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;">
        <p>Iniciando sesión con Google...</p>
    </div>
    `,
})
export class OauthCallback implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private authService: Auth,
        private toastr: ToastrService,
    ) {}

    ngOnInit(): void {
        const status = this.route.snapshot.queryParamMap.get('status');
        const error  = this.route.snapshot.queryParamMap.get('oauth_error');

    if (error === '1' || status !== 'ok') {
        this.toastr.error('No se pudo iniciar sesión con Google', 'Error');
        this.router.navigate(['/login']);
        return;
    }

    // El backend ya creó la sesión con cookie httpOnly
    // Solo necesitamos obtener los datos del usuario.
    this.http.get<any>(`${environment.apiUrl}/user`, { withCredentials: true }).subscribe({
        next: (res) => {
            this.authService.user.set(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));

            this.toastr.success('¡Bienvenido!', res.user.name);

            switch (res.user.role_id) {
                case 1: window.location.href = '/dashboard/cliente'; break;
                case 2: window.location.href = '/dashboard/admin';   break;
                case 3: window.location.href = '/dashboard/empleado'; break;
                default: window.location.href = '/';
            }
        },
        error: () => {
            this.toastr.error('Error al obtener la sesión', 'Error');
            this.router.navigate(['/login']);
        }
    });
    }
}