import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { Marca } from '../../../interfaces/marca.interface';
import { MarcaService } from '../../../services/marca';
import { AuthUser } from '../../../interfaces/auth.interface';
import { Auth } from '../../../services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html', 
  styleUrl: './navbar.scss',
})

export class Navbar implements OnInit {
  // aqui metemos las marcas del back
  marcas: Marca[] = [];
  // y controlamos el estado del dropdown
  isDropdownOpen = false;

  isScrolled = false;

  // para el menú hamburguesa en móvil
  isMenuOpen = false;

  // para el acordeón de marcas dentro del menú móvil
  isMobileMarcasOpen = false;

  isLoggedIn: boolean = false;
  user: AuthUser | null = null;
  isUserMenuOpen: boolean = false;

  @HostListener('window:scroll')
  onScroll() {
    // detecta el scroll para cambiar el fondo del navbar
    this.isScrolled = window.scrollY > 450;
  }

  // cierra el dropdown al hacer click fuera de él
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isDropdownOpen && !this.el.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  constructor(
    private marcaService: MarcaService, 
    private el: ElementRef, 
    private router: Router,
    private authService: Auth, 
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // nada mas cargar el componente, traemos las marcas del back para el dropdown
    this.marcaService.getMarcas().subscribe({
      next: (res) => {
        this.marcas = res;
      }
    });

    // cierra el dropdown en cualquier navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isDropdownOpen = false;
      }
    });

    // comprobamos si hay token al cargar
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.isLoggedIn = true;
      this.user = JSON.parse(user);
      this.cd.detectChanges();
    }
  }

  // metodo para abrir/cerrar el dropdown de marcas
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // metodo para abrir/cerrar el menú hamburguesa en móvil
  toggleMenu() {

    this.isMenuOpen = !this.isMenuOpen;
    // cerramos el acordeón de marcas al cerrar el menú
    if (!this.isMenuOpen) this.isMobileMarcasOpen = false;

    // bloqueamos el scroll del fondo cuando el menú está abierto para que no sea raro
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  // metodo para abrir/cerrar el acordeón de marcas en móvil
  toggleMobileMarcas() {
    this.isMobileMarcasOpen = !this.isMobileMarcasOpen;
  }

  // metodo para abrir/cerrar el menú de usuario
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  // metodo para cerrar sesión
  logout() {
    this.authService.logout().subscribe({
      // con next hacemos la limpieza local aunque falle la petición al backend, porque aunque falle el logout en el backend, el usuario ya no debería tener acceso a nada protegido
        next: () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            this.isLoggedIn = false;
            this.user = null;
            this.toastr.info('Sesión cerrada correctamente');
            this.router.navigate(['/']);
            this.cd.detectChanges();
        },
        error: () => {
            // aunque falle, cerramos la sesión en el cliente para evitar que el usuario quede bloqueado
            this.toastr.info('Sesión cerrada correctamente');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            this.isLoggedIn = false;
            this.user = null;
            this.cd.detectChanges();
            this.router.navigate(['/']);
        }
    });
  }

  getDashboardRoute(): string[] {
    if (!this.user) {
      return ['/'];
    }

    switch (this.user.role_id) {
      case 1:
        return ['/dashboard/cliente'];
      case 2:
        return ['/dashboard/admin'];
      case 3:
        return ['/dashboard/empleado'];
      default:
        return ['/'];
    }
  }

  irAlLogin() {
    this.router.navigate(['/login']);
  }
}