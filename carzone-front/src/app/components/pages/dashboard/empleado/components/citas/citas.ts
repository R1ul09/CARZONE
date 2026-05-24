import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CitaService } from '../../../../../../services/cita';
import { Cita } from '../../../../../../interfaces/cita.interface';

@Component({
  selector: 'app-citas-empleado',
  standalone: true,
  imports: [FormsModule, DatePipe, UpperCasePipe],
  templateUrl: './citas.html',
  styleUrl: './citas.scss'
})
export class CitasEmpleado implements OnChanges {

  @Input() citas: Cita[] = [];
  @Output() citaActualizada = new EventEmitter<void>();

  filtroEstado: string = 'todas';
  filtroFecha: string = '';

  estados: { valor: string; etiqueta: string }[] = [
    { valor: 'pendiente',    etiqueta: 'Pendiente' },
    { valor: 'confirmada',   etiqueta: 'Confirmada' },
    { valor: 'hora_ocupada', etiqueta: 'Hora ocupada' },
    { valor: 'realizada',    etiqueta: 'Realizada' },
    { valor: 'cancelada',    etiqueta: 'Cancelada' },
  ];

  // Panel de mensaje: id de la cita con panel abierto + texto en edición
  mensajeAbierto: number | null = null;
  mensajeTexto: string = '';
  guardandoMensaje: boolean = false;

  constructor(
    private citaService: CitaService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges) {}

  get citasFiltradas(): Cita[] {
    return this.citas.filter(cita => {
      const porEstado = this.filtroEstado === 'todas' || cita.estado === this.filtroEstado;
      const porFecha  = !this.filtroFecha || cita.fecha === this.filtroFecha;
      return porEstado && porFecha;
    });
  }

  cambiarEstado(cita: Cita, estado: string) {
    // Si se cambia a hora_ocupada y aún no hay mensaje, abrimos el panel automáticamente
    if (estado === 'hora_ocupada' && !cita.mensaje_empleado) {
      this.abrirMensaje(cita);
    }

    this.citaService.actualizarEstadoCita(cita.id, estado).subscribe({
      next: () => {
        this.toastr.success(`Estado actualizado a: ${this.etiqueta(estado)}`);
        this.citaActualizada.emit();
      },
      error: () => this.toastr.error('Error al actualizar la cita')
    });
  }

  abrirMensaje(cita: Cita) {
    // Toggle: si ya está abierto para esta cita, lo cerramos
    if (this.mensajeAbierto === cita.id) {
      this.cerrarMensaje();
      return;
    }
    this.mensajeAbierto = cita.id;
    this.mensajeTexto   = cita.mensaje_empleado ?? '';
  }

  cerrarMensaje() {
    this.mensajeAbierto = null;
    this.mensajeTexto   = '';
  }

  guardarMensaje(cita: Cita) {
    this.guardandoMensaje = true;
    this.citaService.actualizarMensaje(cita.id, this.mensajeTexto).subscribe({
      next: () => {
        this.toastr.success('Mensaje guardado');
        this.guardandoMensaje = false;
        this.cerrarMensaje();
        this.citaActualizada.emit();
      },
      error: () => {
        this.toastr.error('Error al guardar el mensaje');
        this.guardandoMensaje = false;
      }
    });
  }

  etiqueta(valor: string): string {
    return this.estados.find(e => e.valor === valor)?.etiqueta ?? valor;
  }
}