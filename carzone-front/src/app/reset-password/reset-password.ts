import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})

export class ResetPassword implements OnInit {

  token: string = '';
  email: string = '';
  password: string = '';
  confirm: string = '';
  cargando: boolean = false;
  exito: boolean = false;

  constructor(
    private authService: Auth,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Laravel envía el enlace con ?token=xxx&email=yyy
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';

    if (!this.token || !this.email) {
      this.toastr.error('Enlace de restablecimiento inválido');
      this.router.navigate(['/forgot-password']);
    }
  }

  resetear() {
    if (!this.password || !this.confirm) {
      this.toastr.warning('Introduce y confirma tu nueva contraseña');
      return;
    }

    if (this.password !== this.confirm) {
      this.toastr.error('Las contraseñas no coinciden');
      return;
    }

    this.cargando = true;

    this.authService.resetPassword(this.token, this.email, this.password).subscribe({
      next: () => {
        this.cargando = false;
        this.exito    = true;
        // Redirigimos al login con toastr de éxito tras 2 segundos
        setTimeout(() => this.router.navigate(['/login']), 2500);
        this.toastr.success('Contraseña actualizada. Redirigiendo al login');
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 422) {
          const msgs = err.error?.errors;
          if (msgs) {
            Object.values(msgs).forEach((mensaje: any) =>
              (mensaje as string[]).forEach(s => this.toastr.error(s))
            );
          } else {
            this.toastr.error('El enlace ha expirado o es inválido. Solicita uno nuevo.');
          }
        } else {
          this.toastr.error('Error al restablecer la contraseña');
        }
      }
    });
  }
}