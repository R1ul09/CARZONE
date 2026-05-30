import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CocheService } from '../../../../../../services/coche';
import { Coche } from '../../../../../../interfaces/coche.interface';

@Component({
  selector: 'app-coches-empleado',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './coches.html',
  styleUrl: './coches.scss'
})

export class CochesEmpleado implements OnChanges{

  @Input() coches: Coche[] = [];
  @Output() cocheActualizado = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    // los getters se recalculan solos, no hace falta nada aquí
  }

  filtro: string = 'todos';

  constructor(
    private cocheService: CocheService,
    private toastr: ToastrService
  ) {}

  get cochesFiltrados(): Coche[] {
    if (this.filtro === 'disponibles') return this.coches.filter(c => c.disponible);
    if (this.filtro === 'reservados') return this.coches.filter(c => !c.disponible);
    return this.coches;
  }

  cambiarDisponibilidad(coche: Coche) {
    this.cocheService.actualizarDisponibilidad(coche.id, !coche.disponible).subscribe({
      next: () => {
        this.toastr.success(`Coche marcado como ${!coche.disponible ? 'disponible' : 'reservado'}`);
        this.cocheActualizado.emit();
      },
      error: () => this.toastr.error('Error al actualizar el coche')
    });
  }
}