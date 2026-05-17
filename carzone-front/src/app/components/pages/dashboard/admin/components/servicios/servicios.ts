import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../../services/admin';
import { Servicio } from '../../../../../../interfaces/servicio.interface';

type ServicioForm = {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number | null;
};

@Component({
  selector: 'app-servicios-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss',
})
export class ServiciosAdmin implements OnChanges {

  @Input() servicios: Servicio[] = [];
  @Output() actualizar = new EventEmitter<void>();

  busqueda: string = '';
  modalAbierto: boolean = false;
  modoEdicion: boolean = false;
  guardando: boolean = false;

  form: ServicioForm = this.formVacio();

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges) {}

  formVacio(): ServicioForm {
    return { nombre: '', descripcion: '', precio: null };
  }

  get serviciosFiltrados(): Servicio[] {
    if (!this.busqueda.trim()) return this.servicios;
    const query = this.busqueda.toLowerCase();
    return this.servicios.filter(servicio =>
      servicio.nombre.toLowerCase().includes(query) ||
      (servicio.descripcion ?? '').toLowerCase().includes(query)
    );
  }

  abrirCrear() {
    this.form = this.formVacio();
    this.modoEdicion = false;
    this.modalAbierto = true;
  }

  abrirEditar(servicio: Servicio) {
    this.form = {
      id: servicio.id,
      nombre: servicio.nombre,
      descripcion: servicio.descripcion ?? '',
      precio: servicio.precio ?? null,
    };
    this.modoEdicion = true;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.form = this.formVacio();
  }

  guardar() {
    if (!this.form.nombre.trim() || !this.form.precio) {
      this.toastr.warning('Completa los campos obligatorios');
      return;
    }

    this.guardando = true;

    const payload = {
      nombre: this.form.nombre.trim(),
      descripcion: this.form.descripcion.trim() || undefined,
      precio: Number(this.form.precio),
    };

    const observable = this.modoEdicion && this.form.id
      ? this.adminService.updateServicio(this.form.id, payload)
      : this.adminService.createServicio(payload);

    observable.subscribe({
      next: () => {
        this.toastr.success(this.modoEdicion ? 'Servicio actualizado' : 'Servicio creado');
        this.cerrarModal();
        this.actualizar.emit();
        this.guardando = false;
      },
      error: () => {
        this.toastr.error('Error al guardar el servicio');
        this.guardando = false;
      }
    });
  }

  eliminar(servicio: Servicio) {
    if (!confirm(`¿Eliminar el servicio ${servicio.nombre}? Esta acción no se puede deshacer.`)) return;

    this.adminService.deleteServicio(servicio.id).subscribe({
      next: () => {
        this.toastr.success('Servicio eliminado');
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al eliminar el servicio')
    });
  }
}
