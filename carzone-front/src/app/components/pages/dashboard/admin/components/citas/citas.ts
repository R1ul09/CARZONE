import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../../services/admin';
import { Cita } from '../../../../../../interfaces/cita.interface';

@Component({
  selector: 'app-citas-admin',
  standalone: true,
  imports: [FormsModule, DatePipe, UpperCasePipe],
  templateUrl: './citas.html',
  styleUrl: './citas.scss'
})

export class CitasAdmin implements OnChanges {

  @Input() citas: Cita[] = [];
  @Output() actualizar = new EventEmitter<void>();

  filtroEstado: string = 'todas';
  filtroFecha: string = '';
  busqueda: string = '';

  estados: string[] = ['pendiente', 'confirmada', 'cancelada', 'realizada'];

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges) {}

  get citasFiltradas(): Cita[] {
    return this.citas.filter(cita => {
      const porEstado = this.filtroEstado === 'todas' || cita.estado === this.filtroEstado;
      const porFecha = !this.filtroFecha || cita.fecha === this.filtroFecha;
      const porBusqueda = !this.busqueda || cita.user?.name.toLowerCase().includes(this.busqueda.toLowerCase()) || cita.servicio?.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      return porEstado && porFecha && porBusqueda;
    });
  }

  cambiarEstado(cita: Cita, estado: string) {
    this.adminService.actualizarCita(cita.id, estado).subscribe({
      next: () => {
        this.toastr.success(`Cita marcada como ${estado}`);
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al actualizar la cita')
    });
  }

  eliminar(cita: Cita) {
    if (!confirm(`¿Eliminar la cita de ${cita.user?.name}? Esta acción no se puede deshacer.`)) return;

    this.adminService.deleteCita(cita.id).subscribe({
      next: () => {
        this.toastr.success('Cita eliminada');
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al eliminar la cita')
    });
  }
}