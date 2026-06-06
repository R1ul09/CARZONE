import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Cita } from '../../../../../../interfaces/cita.interface';
import { Coche } from '../../../../../../interfaces/coche.interface';
import { Marca } from '../../../../../../interfaces/marca.interface';
import { Servicio } from '../../../../../../interfaces/servicio.interface';
import { Cliente } from '../../../../../../interfaces/cliente.interface';

@Component({
  selector: 'app-resumen-admin',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe],
  templateUrl: './resumen.html',
  styleUrl: './resumen.scss'
})

export class ResumenAdmin implements OnChanges {
  @Input() citas: Cita[] = [];
  @Input() coches: Coche[] = [];
  @Input() marcas: Marca[] = [];
  @Input() usuarios: Cliente[] = [];
  @Input() servicios: Servicio[] = [];

  ngOnChanges(changes: SimpleChanges) {}

  get citasHoy(): number {
    const hoy = new Date().toISOString().split('T')[0];
    return this.citas.filter(cita => cita.fecha === hoy).length;
  }

  get citasPendientes(): Cita[] {
    return this.citas.filter(cita => cita.estado === 'pendiente');
  }

  get cochesDisponibles(): number {
    return this.coches.filter(coche => coche.disponible).length;
  }

  get ingresosPotenciales(): number {
    return this.coches?.reduce((sum, coche) => sum + (Number(coche.precio) || 0), 0) ?? 0;
  }

  get proximasCitas(): Cita[] {
    const hoy = new Date().toISOString().split('T')[0];
    return this.citas
      .filter(cita => cita.fecha >= hoy && cita.estado !== 'cancelada')
      .slice(0, 6);
  }

  get clientesCount(): number {
    return this.usuarios.filter(usuario => usuario.role_id === 1).length;
  }
}