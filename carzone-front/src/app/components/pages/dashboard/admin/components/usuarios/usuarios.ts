import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../../services/admin';
import { Cliente } from '../../../../../../interfaces/cliente.interface';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})

export class UsuariosAdmin implements OnChanges {

  @Input() usuarios: Cliente[] = [];
  @Output() actualizar = new EventEmitter<void>();

  busqueda: string = '';
  filtroRol: string = 'todos';

  // Modal crear empleado
  modalAbierto: boolean = false;
  guardando: boolean = false;
  nuevoEmpleado = { name: '', email: '', password: '' };

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

  abrirModal() {
    this.nuevoEmpleado = { name: '', email: '', password: '' };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  crearEmpleado() {
    const { name, email, password } = this.nuevoEmpleado;

    if (!name.trim() || !email.trim() || !password.trim()) {
      this.toastr.warning('Rellena todos los campos');
      return;
    }

    if (password.length < 8) {
      this.toastr.warning('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.guardando = true;

    this.adminService.crearEmpleado(this.nuevoEmpleado).subscribe({
      next: () => {
        this.toastr.success(`Empleado "${name}" creado correctamente`);
        this.guardando = false;
        this.cerrarModal();
        this.actualizar.emit();
      },
      error: (err) => {
        this.guardando = false;
        if (err.status === 422) {
          const errores = err.error?.errors;
          if (errores) {
            Object.values(errores).forEach((msgs: any) =>
              (msgs as string[]).forEach(m => this.toastr.error(m))
            );
          } else {
            this.toastr.error('Datos inválidos');
          }
        } else {
          this.toastr.error('Error al crear el empleado');
        }
      }
    });
  }
}