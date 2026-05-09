import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { Marca } from '../../../interfaces/marca.interface';
import { MarcaService } from '../../../services/marca';

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

  constructor(private marcaService: MarcaService, private el: ElementRef, private router: Router) {}

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
}