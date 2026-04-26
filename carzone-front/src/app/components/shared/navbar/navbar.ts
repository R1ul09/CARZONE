import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Marca } from '../../../interfaces/marca.interface';
import { MarcaService } from '../../../services/marca';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html', 
  styleUrl: './navbar.scss',
})

export class Navbar implements OnInit {
  // aqui metemos las marcas del back
  marcas: Marca[] = [];
  // y controlamos el estado del dropdown
  isDropdownOpen = false;

  isScrolled = false;

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 450;
  }

  constructor(private marcaService: MarcaService) {
    console.log('Navbar component initialized');
  }

  ngOnInit() {
    // nada mas cargar el componente, traemos las marcas del back para el dropdown
    this.marcaService.getMarcas().subscribe({
      next: (res) => {
        this.marcas = res;
        console.log('Marcas cargadas:', res);
      },
      error: (error) => {
        console.error('Error al cargar marcas:', error);
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
