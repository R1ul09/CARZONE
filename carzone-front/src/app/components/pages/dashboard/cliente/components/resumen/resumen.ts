import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Cita } from '../../../../../../interfaces/cita.interface';
import { Financiacion } from '../../../../../../interfaces/financiacion.interface';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './resumen.html',
  styleUrl: './resumen.scss'
})
export class Resumen implements OnInit, OnChanges {

  // input sirve para recibir datos del componente padre (cliente-dashboard)
  // en este caso, recibimos las citas y financiaciones del usuario para mostrar un resumen
  // esta bien para hacer componentes reutilizables
  @Input() citas: Cita[] = [];
  @Input() financiaciones: Financiacion[] = [];

  proximaCita: Cita | null = null;
  diasProximaCita: number | null = null;
  totalFinanciado: number = 0;
  mesActual: Date = new Date();
  diasCalendario: any[] = [];

  ngOnInit() {
    this.procesarDatos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['citas'] || changes['financiaciones']) {
      this.procesarDatos();
    }
  }

  procesarDatos() {
    const hoy = new Date();

    // próxima cita
    const futuras = this.citas
      .filter(c => new Date(c.fecha) >= hoy && c.estado !== 'cancelada')
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    if (futuras.length > 0) {
      this.proximaCita = futuras[0];
      const diff = new Date(futuras[0].fecha).getTime() - hoy.getTime();
      this.diasProximaCita = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    // total financiado
    this.totalFinanciado = this.financiaciones.reduce((acc, f) => {
      return acc + (f.cuota_mensual * f.meses);
    }, 0);

    this.generarCalendario();
  }

  generarCalendario() {
    const año = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();
    const hoy = new Date();
    const ultimoDia = new Date(año, mes + 1, 0);

    let diaSemana = new Date(año, mes, 1).getDay() - 1;
    if (diaSemana < 0) diaSemana = 6;

    this.diasCalendario = [];

    // días mes anterior
    for (let i = diaSemana - 1; i >= 0; i--) {
      const fecha = new Date(año, mes, -i);
      this.diasCalendario.push({
        numero: fecha.getDate(),
        fechaStr: fecha.toISOString().split('T')[0],
        esEsteMes: false,
        esHoy: false,
        tieneCita: false
      });
    }

    // días mes actual
    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      const fecha = new Date(año, mes, d);
      const fechaStr = fecha.toISOString().split('T')[0];
      this.diasCalendario.push({
        numero: d,
        fechaStr,
        esEsteMes: true,
        esHoy: fecha.toDateString() === hoy.toDateString(),
        tieneCita: this.citas.some(c => c.fecha === fechaStr)
      });
    }
  }

  mesAnterior() {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1, 1);
    this.generarCalendario();
  }

  mesSiguiente() {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 1);
    this.generarCalendario();
  }
}