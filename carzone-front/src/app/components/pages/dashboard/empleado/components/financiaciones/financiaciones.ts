import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FinanciacionService } from '../../../../../../services/financiacion';
import { Financiacion } from '../../../../../../interfaces/financiacion.interface';

@Component({
  selector: 'app-financiaciones-empleado',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './financiaciones.html',
  styleUrl: './financiaciones.scss'
})

export class FinanciacionesEmpleado {

  @Input() financiaciones: Financiacion[] = [];
  @Output() actualizar = new EventEmitter<void>();

  // Filtro activo
  filtroEstado: string = 'todas';

  constructor(
    private financiacionService: FinanciacionService,
    private toastr: ToastrService
  ) {}

  get financiacionesFiltradas(): Financiacion[] {
    if (this.filtroEstado === 'todas') return this.financiaciones;
    return this.financiaciones.filter(f => f.estado === this.filtroEstado);
  }

  // El empleado puede aceptar o denegar — misma lógica que el admin
  responder(financiacion: Financiacion, estado: 'aceptada' | 'denegada') {
    this.financiacionService.responderFinanciacion(financiacion.id, estado).subscribe({
      next: () => {
        this.toastr.success(`Financiación ${estado} correctamente`);
        this.actualizar.emit();
      },
      error: () => this.toastr.error('Error al actualizar la financiación')
    });
  }
}