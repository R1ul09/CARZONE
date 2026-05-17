import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CitaService } from '../../../../../../services/cita';
import { Cita, Servicio } from '../../../../../../interfaces/cita.interface';
import { Coche } from '../../../../../../interfaces/coche.interface';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [FormsModule, DatePipe, UpperCasePipe],
  templateUrl: './citas.html',
  styleUrl: './citas.scss'
})

export class Citas implements OnInit {

  @Input() citas: Cita[] = [];
  @Input() servicios: Servicio[] = [];
  @Input() coches: Coche[] = [];

  // cuando se crea o cancela una cita avisamos al padre para que recargue
  @Output() citaCreada = new EventEmitter<void>();
  @Output() citaCancelada = new EventEmitter<void>();

  mostrarForm: boolean = false;
  hoy: string = new Date().toISOString().split('T')[0];

  horasDisponibles: string[] = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  nuevaCita = {
    servicio_id: '',
    coche_id: '',
    fecha: '',
    hora: '10:00'
  };

  constructor(
    private citaService: CitaService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  crearCita() {
    if (!this.nuevaCita.servicio_id || !this.nuevaCita.fecha) {
      this.toastr.warning('Selecciona un servicio y una fecha');
      return;
    }

    this.citaService.crearCita({
      servicio_id: Number(this.nuevaCita.servicio_id),
      coche_id: this.nuevaCita.coche_id ? Number(this.nuevaCita.coche_id) : undefined,
      fecha: this.nuevaCita.fecha,
      hora: this.nuevaCita.hora
    }).subscribe({
      next: () => {
        this.toastr.success('Cita creada correctamente');
        this.mostrarForm = false;
        this.nuevaCita = { servicio_id: '', coche_id: '', fecha: '', hora: '10:00' };
        this.citaCreada.emit(); // avisa al padre para recargar
      },
      error: () => this.toastr.error('Error al crear la cita')
    });
  }

  cancelarCita(id: number) {
    this.citaService.cancelarCita(id).subscribe({
      next: () => {
        this.toastr.info('Cita cancelada');
        this.citaCancelada.emit(); // avisa al padre para recargar
      },
      error: () => this.toastr.error('Error al cancelar la cita')
    });
  }
}