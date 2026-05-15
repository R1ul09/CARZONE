import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PerfilService } from '../../../../../../services/perfil';
import { AuthUser } from '../../../../../../interfaces/auth.interface';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil implements OnInit {

  @Input() user: AuthUser | null = null;

  perfilData = {
    name: '',
    email: ''
  };

  constructor(
    private perfilService: PerfilService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.perfilData.name = this.user?.name || '';
    this.perfilData.email = this.user?.email || '';
  }

  guardarCambios() {
    if (!this.perfilData.name || !this.perfilData.email) {
      this.toastr.warning('Rellena todos los campos');
      return;
    }

    this.perfilService.updatePerfil(this.perfilData).subscribe({
      next: (response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.toastr.success('Perfil actualizado correctamente');
      },
      error: () => this.toastr.error('Error al actualizar el perfil')
    });
  }
}