import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../../../services/admin';
import { FinanciacionService } from '../../../../../services/financiacion';
import { Auth } from '../../../../../services/auth';
import { AuthUser } from '../../../../../interfaces/auth.interface';
import { Cita } from '../../../../../interfaces/cita.interface';
import { Coche } from '../../../../../interfaces/coche.interface';
import { Marca } from '../../../../../interfaces/marca.interface';
import { Servicio } from '../../../../../interfaces/servicio.interface';
import { Cliente } from '../../../../../interfaces/cliente.interface';
import { Financiacion } from '../../../../../interfaces/financiacion.interface';
import { ResumenAdmin } from '../components/resumen/resumen';
import { CochesAdmin } from '../components/coches/coches';
import { MarcasAdmin } from '../components/marcas/marcas';
import { CitasAdmin } from '../components/citas/citas';
import { UsuariosAdmin } from '../components/usuarios/usuarios';
import { ServiciosAdmin } from '../components/servicios/servicios';
import { FinanciacionesAdmin } from '../components/financiaciones/financiaciones';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ResumenAdmin, CochesAdmin, MarcasAdmin, CitasAdmin, UsuariosAdmin, ServiciosAdmin, FinanciacionesAdmin],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {

  user: AuthUser | null = null;
  seccionActiva: string = 'resumen';

  citas: Cita[] = [];
  coches: Coche[] = [];
  marcas: Marca[] = [];
  servicios: Servicio[] = [];
  usuarios: Cliente[] = [];
  financiaciones: Financiacion[] = [];

  datosListos: boolean = false;
  cargaError: boolean = false;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private financiacionService: FinanciacionService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private authService: Auth
  ) {}

  ngOnInit() {
    const usuario = this.authService.user();
    if (!usuario) { this.router.navigate(['/login']); return; }
    if (usuario.role_id !== 2) { this.router.navigate(['/']); return; }
    this.user = usuario;
    this.cargarDatos();
  }

  cargarDatos() {
    this.datosListos = false;
    this.cargaError = false;

    forkJoin({
      citas: this.adminService.getCitas(),
      coches: this.adminService.getCoches(),
      marcas: this.adminService.getMarcas(),
      servicios: this.adminService.getServicios(),
      usuarios: this.adminService.getUsuarios(),
      financiaciones: this.financiacionService.getTodasLasFinanciaciones(),
    }).subscribe({
      next: ({ citas, coches, marcas, servicios, usuarios, financiaciones }) => {
        this.citas          = citas;
        this.coches         = coches;
        this.marcas         = marcas;
        this.servicios      = servicios;
        this.usuarios       = usuarios;
        this.financiaciones = financiaciones;
        this.datosListos    = true;
        this.cargaError     = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.cargaError  = true;
        this.datosListos = true;
        this.toastr.error('Error al cargar los datos del panel');
        this.cd.detectChanges();
      }
    });
  }

  setSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }

  // Badge con el número de citas pendientes
  get badgeCitas(): number {
    return this.citas.filter(c => c.estado === 'pendiente').length;
  }

  // Badge con el número de financiaciones pendientes
  get badgeFinanciaciones(): number {
    return this.financiaciones.filter(f => f.estado === 'pendiente').length;
  }
}