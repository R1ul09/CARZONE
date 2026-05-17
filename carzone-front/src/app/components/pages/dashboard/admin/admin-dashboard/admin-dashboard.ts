import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../../../services/admin';
import { AuthUser } from '../../../../../interfaces/auth.interface';
import { Cita } from '../../../../../interfaces/cita.interface';
import { Coche } from '../../../../../interfaces/coche.interface';
import { Marca } from '../../../../../interfaces/marca.interface';
import { Servicio } from '../../../../../interfaces/servicio.interface';
import { Cliente } from '../../../../../interfaces/cliente.interface';
import { ResumenAdmin } from '../components/resumen/resumen';
import { CochesAdmin } from '../components/coches/coches';
import { MarcasAdmin } from '../components/marcas/marcas';
import { CitasAdmin } from '../components/citas/citas';
import { UsuariosAdmin } from '../components/usuarios/usuarios';
import { ServiciosAdmin } from '../components/servicios/servicios';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ResumenAdmin, CochesAdmin, MarcasAdmin, CitasAdmin, UsuariosAdmin, ServiciosAdmin],
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

  datosListos: boolean = false;
  cargaError: boolean = false;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    if (!token) { this.router.navigate(['/login']); return; }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      // Doble comprobación de seguridad en cliente
      if (this.user?.role_id !== 2) {
        this.router.navigate(['/']);
        return;
      }
    }
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
    }).subscribe({
      next: ({ citas, coches, marcas, servicios, usuarios }) => {
        this.citas = citas;
        this.coches = coches;
        this.marcas = marcas;
        this.servicios = servicios;
        this.usuarios = usuarios;
        this.datosListos = true;
        this.cargaError = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.cargaError = true;
        this.datosListos = true;
        this.toastr.error('Error al cargar los datos del panel');
        this.cd.detectChanges();
      }
    });
  }

  setSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }

  get badgeCitas(): number {
    return this.citas.filter(c => c.estado === 'pendiente').length;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.toastr.info('Sesión cerrada');
    this.router.navigate(['/']);
  }
}