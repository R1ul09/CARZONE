import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FinanciacionService } from '../../../../../../services/financiacion';
import { Financiacion } from '../../../../../../interfaces/financiacion.interface';

@Component({
  selector: 'app-financiaciones-admin',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './financiaciones.html',
  styleUrl: './financiaciones.scss'
})

export class FinanciacionesAdmin {

  @Input() financiaciones: Financiacion[] = [];
  @Output() actualizar = new EventEmitter<void>();

  // Filtro activo: 'todas', 'pendiente', 'aceptada', 'denegada'
  filtroEstado: string = 'todas';

  constructor(
    private financiacionService: FinanciacionService,
    private toastr: ToastrService
  ) {}

  // Devuelve las financiaciones filtradas según el estado seleccionado
  get financiacionesFiltradas(): Financiacion[] {
    if (this.filtroEstado === 'todas') return this.financiaciones;
    return this.financiaciones.filter(f => f.estado === this.filtroEstado);
  }

  // El empleado/admin acepta o deniega una financiación
  responder(financiacion: Financiacion, estado: 'aceptada' | 'denegada') {
    this.financiacionService.responderFinanciacion(financiacion.id, estado).subscribe({
      next: () => {
        this.toastr.success(`Financiación ${estado} correctamente`);
        this.actualizar.emit(); // Avisamos al dashboard para que recargue los datos
      },
      error: () => this.toastr.error('Error al actualizar la financiación')
    });
  }

  // El admin puede eliminar una financiación
  eliminar(financiacion: Financiacion) {
    if (!confirm(`¿Eliminar la financiación de ${financiacion.user?.name}?`)) return;

    this.financiacionService.eliminarFinanciacion(financiacion.id).subscribe({
      next: () => {
        this.toastr.success('Financiación eliminada');
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al eliminar la financiación')
    });
  }
}