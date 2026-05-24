import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FinanciacionService } from '../../../../../../services/financiacion';
import { Financiacion } from '../../../../../../interfaces/financiacion.interface';

@Component({
  selector: 'app-financiaciones',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './financiaciones.html',
  styleUrl: './financiaciones.scss'
})
export class Financiaciones implements OnChanges {

  @Input() financiaciones: Financiacion[] = [];
  @Output() financiacionEliminada = new EventEmitter<void>();

  constructor(
    private financiacionService: FinanciacionService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges) {}

  eliminar(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta financiación?')) return;

    this.financiacionService.eliminarFinanciacion(id).subscribe({
      next: () => {
        this.toastr.info('Financiación eliminada');
        this.financiacionEliminada.emit();
      },
      error: () => this.toastr.error('Error al eliminar la financiación')
    });
  }
}