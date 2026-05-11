import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CitaService } from '../../../services/cita';
import { FinanciacionService } from '../../../services/financiacion';
import { PerfilService } from '../../../services/perfil';
import { ServicioService } from '../../../services/servicio';
import { CocheService } from '../../../services/coche';
import { AuthUser } from '../../../interfaces/auth.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe, UpperCasePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  user: AuthUser | null = null;
  seccionActiva: string = 'resumen';
  mostrarFormCita: boolean = false;

  citas: any[] = [];
  financiaciones: any[] = [];
  servicios: any[] = [];
  cochesDisponibles: any[] = [];

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

  perfilData = {
    name: '',
    email: ''
  };

  constructor(
    private router: Router,
    private citaService: CitaService,
    private financiacionService: FinanciacionService,
    private perfilService: PerfilService,
    private servicioService: ServicioService,
    private cocheService: CocheService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // comprueba si está logueado
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.perfilData.name = this.user?.name || '';
      this.perfilData.email = this.user?.email || '';
    }

    this.cargarDatos();
  }

  cargarDatos() {
    this.citaService.getCitas().subscribe({
      next: data => this.citas = data,
      error: () => this.toastr.error('Error al cargar las citas')
    });

    this.financiacionService.getFinanciaciones().subscribe({
      next: data => this.financiaciones = data,
      error: () => this.toastr.error('Error al cargar las financiaciones')
    });

    this.servicioService.getServicios().subscribe({
      next: data => this.servicios = data,
      error: () => {}
    });

    this.cocheService.getTodosLosCoches().subscribe({
      next: data => this.cochesDisponibles = data,
      error: () => {}
    });
  }

  setSeccion(seccion: string) {
    this.seccionActiva = seccion;
    this.mostrarFormCita = false;
  }

  crearCita() {
    if (!this.nuevaCita.servicio_id || !this.nuevaCita.fecha || !this.nuevaCita.hora) {
      this.toastr.warning('Rellena todos los campos obligatorios');
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
        this.mostrarFormCita = false;
        this.nuevaCita = { servicio_id: '', coche_id: '', fecha: '', hora: '10:00' };
        this.citaService.getCitas().subscribe(data => this.citas = data);
      },
      error: () => this.toastr.error('Error al crear la cita')
    });
  }

  cancelarCita(id: number) {
    this.citaService.cancelarCita(id).subscribe({
      next: () => {
        this.toastr.info('Cita cancelada');
        this.citas = this.citas.filter(c => c.id !== id);
      },
      error: () => this.toastr.error('Error al cancelar la cita')
    });
  }

  guardarPerfil() {
    this.perfilService.updatePerfil(this.perfilData).subscribe({
      next: (response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.user = response;
        this.toastr.success('Perfil actualizado correctamente');
      },
      error: () => this.toastr.error('Error al actualizar el perfil')
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.toastr.info('Sesión cerrada');
    this.router.navigate(['/']);
  }
}