import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Cita } from '../../../../../../interfaces/cita.interface';
import { Coche } from '../../../../../../interfaces/coche.interface';

@Component({
  selector: 'app-resumen-empleado',
  standalone: true,
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './resumen.html',
  styleUrl: './resumen.scss'
})

export class ResumenEmpleado implements OnChanges {

  @Input() citas: Cita[] = [];
  @Input() coches: Coche[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['citas'] || changes['coches']) {
      // como no tenemos un procesar datos, con simplemente poner esto ya se actualizará todo lo que dependa de citas y coches (getters)
    }
  }

  get citasHoy(): Cita[] {
    const hoy = new Date().toISOString().split('T')[0];
    return this.citas.filter(c => c.fecha === hoy);
  }

  get citasPendientes(): Cita[] {
    return this.citas.filter(c => c.estado === 'pendiente');
  }

  get cochesDisponibles(): number {
    return this.coches.filter(c => c.disponible).length;
  }

  get cochesReservados(): number {
    return this.coches.filter(c => !c.disponible).length;
  }

  get proximasCitas(): Cita[] {
    const hoy = new Date().toISOString().split('T')[0];
    return this.citas
      .filter(c => c.fecha >= hoy && c.estado !== 'cancelada')
      .slice(0, 5);
  }
}