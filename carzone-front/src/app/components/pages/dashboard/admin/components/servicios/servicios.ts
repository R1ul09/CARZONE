import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../../services/admin';
import { Servicio } from '../../../../../../interfaces/servicio.interface';

type ServicioForm = {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number | null;
  duracion_minutos: number | null;
};

@Component({
  selector: 'app-servicios-admin',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss'
})

export class ServiciosAdmin implements OnChanges {

  @Input() servicios: Servicio[] = [];
  @Output() actualizar = new EventEmitter<void>();

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
    return { nombre: '', descripcion: '', precio: null, duracion_minutos: null };
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
      duracion_minutos: servicio.duracion_minutos ?? null,
    };
    this.modoEdicion = true;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.form = this.formVacio();
  }

  guardar() {
    if (!this.form.nombre.trim()) {
      this.toastr.warning('El nombre del servicio es obligatorio');
      return;
    }
    this.guardando = true;

    const servicioData: Partial<Servicio> = {
      nombre: this.form.nombre,
      descripcion: this.form.descripcion,
      precio: this.form.precio ?? 0,
      duracion_minutos: this.form.duracion_minutos ?? 0
    };

    const obs = this.modoEdicion && this.form.id
      ? this.adminService.updateServicio(this.form.id, servicioData)
      : this.adminService.createServicio(servicioData);

    obs.subscribe({
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
    if (!confirm(`¿Eliminar el servicio "${servicio.nombre}"?`)) return;

    this.adminService.deleteServicio(servicio.id).subscribe({
      next: () => {
        this.toastr.success('Servicio eliminado');
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al eliminar el servicio')
    });
  }
}