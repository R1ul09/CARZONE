import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { CitaService } from '../../../../../services/cita';
import { Auth } from '../../../../../services/auth';
import { CocheService } from '../../../../../services/coche';
import { AuthUser } from '../../../../../interfaces/auth.interface';
import { Cita } from '../../../../../interfaces/cita.interface';
import { Coche } from '../../../../../interfaces/coche.interface';
import { ResumenEmpleado } from '../components/resumen/resumen';
import { CitasEmpleado } from '../components/citas/citas';
import { CochesEmpleado } from '../components/coches/coches';
import { ClientesEmpleado } from '../components/clientes/clientes';

@Component({
  selector: 'app-empleado-dashboard',
  standalone: true,
  imports: [ResumenEmpleado, CitasEmpleado, CochesEmpleado, ClientesEmpleado],
  templateUrl: './empleado-dashboard.html',
  styleUrl: './empleado-dashboard.scss'
})

export class EmpleadoDashboard implements OnInit {

  // Datos del empleado
  user: AuthUser | null = null;
  seccionActiva: string = 'resumen';

  citas: Cita[] = [];
  coches: Coche[] = [];

  constructor(
    private router: Router,
    private citaService: CitaService,
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
  cargaError: boolean = false;

  cargarDatos() {
    this.datosListos = false;
    this.cargaError = false;

    forkJoin({
        citas: this.citaService.getTodasLasCitas(),
        coches: this.cocheService.getTodosLosCoches()
    }).subscribe({
        next: ({ citas, coches }) => {
            this.citas = citas;
            this.coches = coches;
            this.datosListos = true;
            this.cargaError = false;
            this.cd.detectChanges();
        },
        error: () => {
            this.cargaError = true;
            this.datosListos = true;
            this.toastr.error('Error al cargar los datos');
            this.cd.detectChanges();
        }
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