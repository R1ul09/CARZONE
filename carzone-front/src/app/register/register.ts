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
  // Propiedades para el formulario
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: Auth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // metodo para manejar el registro
  register() {
    // Validación básica en el front antes de enviar
    if (!this.name || !this.email || !this.password) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden', 'Error');
      return;
    }

    // Llamada al servicio register
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        this.toastr.success(`¡Cuenta creada! Bienvenido ${response.user.name}`, 'Éxito');
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 422) {
          const backendErrors = err.error.errors;
          
          // Esto recorre CUALQUIER error que Laravel detecte
          Object.keys(backendErrors).forEach((field) => {
            // Laravel puede devolver varios errores por campo (ej: min y symbols)
            backendErrors[field].forEach((message: string) => {
              this.toastr.error(message, 'Error en ' + field);
            });
          });
        } else {
          this.toastr.error('Ocurrió un error inesperado', 'Error');
        }
      }
    });
  }
  
}