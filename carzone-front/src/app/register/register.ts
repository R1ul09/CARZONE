import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  cargando: boolean = false;

  // Una vez registrado, mostramos el aviso de verificación en lugar del form
  registroExitoso: boolean = false;
  nombreRegistrado: string = '';

  constructor(
    private authService: Auth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  register() {
    if (!this.name || !this.email || !this.password) {
      this.toastr.error('Todos los campos son obligatorios');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden');
      return;
    }

    this.cargando = true;

    // CSRF
    this.authService.getCsrfCookie().subscribe({
      next: () => {
        // registro
        this.authService.doRegister(this.name, this.email, this.password).subscribe({
          next: (res) => {
            this.cargando = false;
            this.nombreRegistrado = res.user.name;
            this.registroExitoso  = true;
            this.toastr.success('¡Cuenta creada! Revisa tu email para verificar tu cuenta');
          },
          error: (err) => {
            this.cargando = false;
            if (err.status === 422 && err.error?.errors) {
              Object.values(err.error.errors).forEach((mensages: any) =>
                (mensages as string[]).forEach(m => this.toastr.error(m))
              );
            } else {
              this.toastr.error('Error al crear la cuenta');
            }
          }
        });
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('Error de conexión con el servidor');
      }
    });
  }

  reenviarVerificacion() {
    this.authService.reenviarVerificacion().subscribe({
      next: () => this.toastr.success('Email de verificación reenviado'),
      error: () => this.toastr.error('No se pudo reenviar el email')
    });
  }
}