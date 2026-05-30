import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { CitaService } from '../../../../../services/cita';
import { Auth } from '../../../../../services/auth';
import { FinanciacionService } from '../../../../../services/financiacion';
import { ServicioService } from '../../../../../services/servicio';
import { CocheService } from '../../../../../services/coche';
import { AuthUser } from '../../../../../interfaces/auth.interface';
import { Cita } from '../../../../../interfaces/cita.interface';
import { Financiacion } from '../../../../../interfaces/financiacion.interface';
import { Coche } from '../../../../../interfaces/coche.interface';
import { Servicio } from '../../../../../interfaces/cita.interface';
import { Resumen as ResumenComponent } from '../components/resumen/resumen';
import { Citas as CitasComponent } from '../components/citas/citas';
import { Financiaciones as FinanciacionesComponent } from '../components/financiaciones/financiaciones';
import { Perfil as PerfilComponent } from '../components/perfil/perfil';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  imports: [ResumenComponent, CitasComponent, FinanciacionesComponent, PerfilComponent],
  templateUrl: './cliente-dashboard.html',
  styleUrl: './cliente-dashboard.scss'
})
export class ClienteDashboard implements OnInit {

  user: AuthUser | null = null;
  seccionActiva: string = 'resumen';

  citas: Cita[] = [];
  financiaciones: Financiacion[] = [];
  servicios: Servicio[] = [];
  cochesDisponibles: Coche[] = [];

  constructor(
    private router: Router,
    private citaService: CitaService,
    private financiacionService: FinanciacionService,
    private servicioService: ServicioService,
    private cocheService: CocheService,
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

  datosListos: boolean = false;

  cargarDatos() {
    forkJoin({
      citas: this.citaService.getCitas(),
      financiaciones: this.financiacionService.getFinanciaciones(),
      servicios: this.servicioService.getServicios(),
      coches: this.cocheService.getTodosLosCoches()
    }).subscribe({
      next: ({ citas, financiaciones, servicios, coches }) => {
        this.citas = citas;
        this.financiaciones = financiaciones;
        this.servicios = servicios;
        this.cochesDisponibles = coches;
        this.datosListos = true;
        this.cd.detectChanges();
      },
      error: () => this.toastr.error('Error al cargar los datos')
    });
  }

  setSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }

  logout() {
    this.authService.logout().subscribe({
      complete: () => this.router.navigate(['/'])
    });
    this.toastr.info('Sesión cerrada');
  }
}