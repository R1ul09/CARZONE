import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})

export class ForgotPassword {

  email: string = '';
  cargando: boolean = false;
  enviado: boolean = false;

  constructor(
    private authService: Auth,
    private toastr: ToastrService
  ) {}

  enviar() {
    if (!this.email) {
      this.toastr.warning('Introduce tu correo electrónico');
      return;
    }

    this.cargando = true;

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.cargando = false;
        this.enviado  = true;
        this.toastr.success('Te hemos enviado un enlace de recuperación');
      },
      error: (err) => {
        console.error('Error forgot-password:', err);
        this.cargando = false;
        if (err.status === 422) {
          const msgs = err.error?.errors?.email;
          if (msgs?.length) {
            msgs.forEach((m: string) => this.toastr.error(m));
          } else {
            this.toastr.error('No existe ninguna cuenta con ese email');
          }
        } else if (err.status === 0) {
          this.toastr.error('No se puede conectar con el servidor');
        } else {
          this.toastr.error(`Error al enviar el email (${err.status})`);
        }
      }
    });
  }
}