import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Auth } from '../services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  email: string = '';
  password: string = '';
  cargando: boolean = false;

  constructor(
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Si ya está logueado, redirigir a home
    if (this.authService.user()) {
      this.toastr.info('Ya estás logueado', 'Información');
      this.router.navigate(['/']);
      return;
    }

    const verified = this.route.snapshot.queryParamMap.get('verified');
    const alreadyVerif = this.route.snapshot.queryParamMap.get('already_verified');

    if (verified === '1') {
      this.toastr.success('¡Email verificado correctamente! Ya puedes iniciar sesión.', 'Verificado correctamente');
    }
    if (alreadyVerif === '1') {
      this.toastr.info('Tu email ya estaba verificado. Inicia sesión.', 'Info');
    }
  }

  login() {
    if (!this.email || !this.password) {
      this.toastr.warning('Rellena email y contraseña');
      return;
    }

    this.cargando = true;

    // Si hay sesión activa, la cerramos primero para evitar conflictos de cookie
    const hayUsuario = this.authService.user();
    if (hayUsuario) {
      this.authService.logout().subscribe({ complete: () => this.hacerLogin() });
    } else {
      this.hacerLogin();
    }
  }

  private hacerLogin() {
    this.authService.getCsrfCookie().subscribe({
      next: () => {
        this.authService.doLogin(this.email, this.password).subscribe({
          next: (res) => {
            this.cargando = false;

            if (!res.email_verified) {
              // Reenviar el correo de verificación automáticamente
              this.authService.reenviarVerificacion().subscribe({
                next: () => {
                  this.toastr.warning(
                    'Te hemos reenviado el enlace de verificación. Revisa tu bandeja de entrada.',
                    `Hola ${res.user.name}`
                  );
                },
                error: () => {
                  this.toastr.warning(
                    'Verifica tu email antes de continuar. Revisa tu bandeja de entrada.',
                    `Hola ${res.user.name}`
                  );
                }
              });
              return;
            }

            this.toastr.success(res.message, 'Bienvenido');

            switch (res.user.role_id) {
              case 1: this.router.navigate(['/dashboard/cliente']);  break;
              case 2: this.router.navigate(['/dashboard/admin']);    break;
              case 3: this.router.navigate(['/dashboard/empleado']); break;
              default: this.router.navigate(['/']);
            }
          },
          error: (err) => {
            this.cargando = false;
            if (err.status === 422) {
              this.toastr.error('Credenciales incorrectas', 'Error');
            } else {
              this.toastr.error('Error al iniciar sesión', 'Error');
            }
          }
        });
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('Error de conexión con el servidor', 'Error');
      }
    });
  }

  loginConGoogle(): void {
    this.authService.loginConGoogle();
  }
}