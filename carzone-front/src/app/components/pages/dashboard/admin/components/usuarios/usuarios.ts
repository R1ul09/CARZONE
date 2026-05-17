import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../../services/admin';
import { Cliente } from '../../../../../../interfaces/cliente.interface';

type UsuarioForm = {
  id?: number;
  name: string;
  email: string;
  role_id: number | null;
};

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class UsuariosAdmin implements OnChanges {

  @Input() usuarios: Cliente[] = [];
  @Output() actualizar = new EventEmitter<void>();

  busqueda: string = '';
  modalAbierto: boolean = false;
  modoEdicion: boolean = false;
  guardando: boolean = false;

  form: UsuarioForm = this.formVacio();

  roleMap: Record<number, string> = {
    1: 'Cliente',
    2: 'Administrador',
    3: 'Empleado'
  };

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges) {}

  formVacio(): UsuarioForm {
    return { name: '', email: '', role_id: null };
  }

  get usuariosFiltrados(): Cliente[] {
    if (!this.busqueda.trim()) return this.usuarios;
    const query = this.busqueda.toLowerCase();
    return this.usuarios.filter(usuario =>
      usuario.name.toLowerCase().includes(query) ||
      usuario.email.toLowerCase().includes(query) ||
      this.roleMap[usuario.role_id]?.toLowerCase().includes(query)
    );
  }

  abrirEditar(usuario: Cliente) {
    this.form = {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      role_id: usuario.role_id,
    };
    this.modoEdicion = true;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.form = this.formVacio();
  }

  guardar() {
    if (!this.form.id) {
      this.toastr.warning('Selecciona un usuario para editar');
      return;
    }

    if (!this.form.name.trim() || !this.form.email.trim() || !this.form.role_id) {
      this.toastr.warning('Completa los campos obligatorios');
      return;
    }

    this.guardando = true;

    this.adminService.updateUsuario(this.form.id, {
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      role_id: this.form.role_id,
    }).subscribe({
      next: () => {
        this.toastr.success('Usuario actualizado');
        this.cerrarModal();
        this.actualizar.emit();
        this.guardando = false;
      },
      error: () => {
        this.toastr.error('Error al actualizar el usuario');
        this.guardando = false;
      }
    });
  }

  eliminar(usuario: Cliente) {
    if (!confirm(`¿Eliminar al usuario ${usuario.name}? Esta acción no se puede deshacer.`)) return;

    this.adminService.deleteUsuario(usuario.id).subscribe({
      next: () => {
        this.toastr.success('Usuario eliminado');
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al eliminar el usuario')
    });
  }
}
