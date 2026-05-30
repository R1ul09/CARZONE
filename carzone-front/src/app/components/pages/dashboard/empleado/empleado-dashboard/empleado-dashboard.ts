import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { CitaService } from '../../../../../services/cita';
import { CocheService } from '../../../../../services/coche';
import { FinanciacionService } from '../../../../../services/financiacion';
import { Auth } from '../../../../../services/auth';
import { AuthUser } from '../../../../../interfaces/auth.interface';
import { Cita } from '../../../../../interfaces/cita.interface';
import { Coche } from '../../../../../interfaces/coche.interface';
import { Financiacion } from '../../../../../interfaces/financiacion.interface';
import { ResumenEmpleado } from '../components/resumen/resumen';
import { CitasEmpleado } from '../components/citas/citas';
import { CochesEmpleado } from '../components/coches/coches';
import { ClientesEmpleado } from '../components/clientes/clientes';
import { FinanciacionesEmpleado } from '../components/financiaciones/financiaciones';

@Component({
  selector: 'app-empleado-dashboard',
  standalone: true,
  imports: [ResumenEmpleado, CitasEmpleado, CochesEmpleado, ClientesEmpleado, FinanciacionesEmpleado],
  templateUrl: './empleado-dashboard.html',
  styleUrl: './empleado-dashboard.scss'
})
export class EmpleadoDashboard implements OnInit {

  user: AuthUser | null = null;
  seccionActiva: string = 'resumen';

  citas: Cita[] = [];
  coches: Coche[] = [];
  financiaciones: Financiacion[] = [];

  datosListos: boolean = false;
  cargaError: boolean = false;

  constructor(
    private router: Router,
    private citaService: CitaService,
    private cocheService: CocheService,
    private financiacionService: FinanciacionService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private authService: Auth
  ) {}

  ngOnInit() {
    const usuario = this.authService.user();
    if (!usuario) { this.router.navigate(['/login']); return; }
    this.user = usuario;
    this.cargarDatos();
  }

  cargarDatos() {
    this.datosListos = false;
    this.cargaError  = false;

    forkJoin({
      citas: this.citaService.getTodasLasCitas(),
      coches: this.cocheService.getTodosLosCoches(),
      financiaciones: this.financiacionService.getTodasLasFinanciaciones(),
    }).subscribe({
      next: ({ citas, coches, financiaciones }) => {
        this.citas = citas;
        this.coches = coches;
        this.financiaciones = financiaciones;
        this.datosListos = true;
        this.cargaError = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.cargaError  = true;
        this.datosListos = true;
        this.toastr.error('Error al cargar los datos');
        this.cd.detectChanges();
      }
    });
  }

  setSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }

  // Badge de financiaciones pendientes para el sidebar
  get badgeFinanciaciones(): number {
    return this.financiaciones.filter(f => f.estado === 'pendiente').length;
  }

  logout() {
    this.authService.logout().subscribe({
      complete: () => this.router.navigate(['/'])
    });
    this.toastr.info('Sesión cerrada');
  }
}