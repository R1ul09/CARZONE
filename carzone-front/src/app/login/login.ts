import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {

  email: string = '';
  password: string = '';

  constructor(
    private authService: Auth, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Guardar el token en localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.toastr.success(`Bienvenido, ${response.user.name}`, 'Sesión iniciada');
        
        // redirige según el rol
        const roleId = Number(response.user.role_id);
        switch (roleId) {
            case 1: this.router.navigate(['/dashboard/cliente']); break;
            case 2: this.router.navigate(['/dashboard/admin']); break;
            case 3: this.router.navigate(['/dashboard/empleado']); break;
            default: this.router.navigate(['/']);
        }
      },
      error: () => {
          this.toastr.error('Credenciales incorrectas', 'Error');
      }
    });
  }
}
