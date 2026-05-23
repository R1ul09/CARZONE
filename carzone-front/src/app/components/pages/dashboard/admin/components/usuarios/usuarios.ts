import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../../services/admin';
import { Cliente } from '../../../../../../interfaces/cliente.interface';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class UsuariosAdmin implements OnChanges {

  @Input() usuarios: Cliente[] = [];
  @Output() actualizar = new EventEmitter<void>();

  busqueda: string = '';
  filtroRol: string = 'todos';

  // ID del admin logueado — para ocultarse de su propia lista
  private miId: number | null = null;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const me = JSON.parse(userStr);
      this.miId = me.id;
    }
  }

  ngOnChanges(changes: SimpleChanges) {}

  get usuariosFiltrados(): Cliente[] {
    return this.usuarios.filter(user => {
      // Nunca mostrarse a sí mismo
      if (user.id === this.miId) return false;

      const porRol = this.filtroRol === 'todos' || String(user.role_id) === this.filtroRol;
      const porBusqueda = !this.busqueda ||
        user.name.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        user.email.toLowerCase().includes(this.busqueda.toLowerCase());

      return porRol && porBusqueda;
    });
  }

  nombreRol(roleId: number): string {
    const roles: Record<number, string> = { 1: 'Cliente', 2: 'Admin', 3: 'Empleado' };
    return roles[roleId] ?? 'Desconocido';
  }

  cambiarRol(usuario: Cliente, nuevoRoleId: number) {
    this.adminService.updateUsuario(usuario.id, { role_id: nuevoRoleId }).subscribe({
      next: () => {
        this.toastr.success(`Rol actualizado a ${this.nombreRol(nuevoRoleId)}`);
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al cambiar el rol')
    });
  }

  eliminar(usuario: Cliente) {
    if (!confirm(`¿Eliminar al usuario "${usuario.name}"? Esta acción no se puede deshacer.`)) return;

    this.adminService.deleteUsuario(usuario.id).subscribe({
      next: () => {
        this.toastr.success('Usuario eliminado');
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al eliminar el usuario')
    });
  }
}