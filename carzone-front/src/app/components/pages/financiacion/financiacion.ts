import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CocheService } from '../../../services/coche';
import { FinanciacionService } from '../../../services/financiacion';
import { Coche } from '../../../interfaces/coche.interface';

@Component({
  selector: 'app-financiacion',
  templateUrl: './financiacion.html',
  styleUrl: './financiacion.scss',
  imports: [FormsModule, CurrencyPipe]
})

export class Financiacion implements OnInit {

  coches: Coche[] = [];
  cocheSeleccionadoId: number | string = '';
  cocheSeleccionado: Coche | null = null;

  // Calculadora
  precioVehiculo: number = 200000;
  entrada: number = 40000;
  plazoSeleccionado: number = 60;
  plazos: number[] = [24, 36, 48, 60, 72, 84];
  interes: number = 3.9;
  cuotaMensual: number = 0;

  // Formulario
  formData = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  };

  ventajas = [
    { texto: 'Aprobación en 24 horas' },
    { texto: 'Tasas competitivas desde 3,9% TAE' },
    { texto: 'Plazos hasta 84 meses' },
    { texto: 'Sin penalización por pago anticipado' },
    { texto: 'Financiación hasta el 100% del valor' },
    { texto: 'Asesor personal dedicado' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cocheService: CocheService,
    private financiacionService: FinanciacionService
  ) {}

  ngOnInit() {
    this.cocheService.getTodosLosCoches().subscribe(data => {
      this.coches = data;

      // Si viene con ?coche=id en la URL lo preselecciona
      const cocheId = this.route.snapshot.queryParamMap.get('coche');
      if (cocheId) {
        this.cocheSeleccionadoId = Number(cocheId);
        this.onCocheChange();
      }
    });

    this.calcular();
  }

  onCocheChange() {
    this.cocheSeleccionado = this.coches.find(
      c => c.id === Number(this.cocheSeleccionadoId)
    ) ?? null;

    if (this.cocheSeleccionado) {
      this.precioVehiculo = this.cocheSeleccionado.precio;
      this.entrada = Math.round(this.cocheSeleccionado.precio * 0.2);
      this.calcular();
    }
  }

  setPlazo(plazo: number) {
    this.plazoSeleccionado = plazo;
    this.calcular();
  }

  calcular() {
    const capital = this.precioVehiculo - this.entrada;
    const tasaMensual = this.interes / 100 / 12;
    // n es el número total de pagos (meses)
    const n = this.plazoSeleccionado;

    if (capital <= 0) {
      this.cuotaMensual = 0;
      return;
    }

    // Fórmula estándar de cuota mensual
    this.cuotaMensual = Math.round(
      (capital * tasaMensual * Math.pow(1 + tasaMensual, n)) /
      (Math.pow(1 + tasaMensual, n) - 1)
    );
  }

  solicitar() {
    // Comprueba si está logueado
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.cocheSeleccionadoId || !this.formData.nombre || !this.formData.email) {
      alert('Por favor rellena todos los campos obligatorios');
      return;
    }

    this.financiacionService.solicitarFinanciacion({
      coche_id: Number(this.cocheSeleccionadoId),
      meses: this.plazoSeleccionado,
      cuota_mensual: this.cuotaMensual,
      entrada: this.entrada,
      interes: this.interes
    }).subscribe({
      next: () => alert('Solicitud enviada correctamente. Nos pondremos en contacto contigo.'),
      error: () => alert('Ha ocurrido un error. Inténtalo de nuevo.')
    });
  }
}