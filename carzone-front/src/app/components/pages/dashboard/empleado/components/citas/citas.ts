import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
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

  ngOnChanges(changes: SimpleChanges) {
    // los getters se recalculan solos, no hace falta nada aquí
  }

  filtroEstado: string = 'todas';
  filtroFecha: string = '';

  estados: string[] = ['pendiente', 'confirmada', 'cancelada'];

  constructor(
    private citaService: CitaService,
    private toastr: ToastrService
  ) {}

  get citasFiltradas(): Cita[] {
    return this.citas.filter(cita => {
      const porEstado = this.filtroEstado === 'todas' || cita.estado === this.filtroEstado;
      const porFecha = !this.filtroFecha || cita.fecha === this.filtroFecha;
      return porEstado && porFecha;
    });
  }

  cambiarEstado(cita: Cita, estado: string) {
    this.citaService.actualizarEstadoCita(cita.id, estado).subscribe({
      next: () => {
        this.toastr.success(`Cita marcada como ${estado}`);
        this.citaActualizada.emit();
      },
      error: () => this.toastr.error('Error al actualizar la cita')
    });
  }
}