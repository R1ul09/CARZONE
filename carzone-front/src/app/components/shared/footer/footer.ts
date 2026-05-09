import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Marca } from '../../../interfaces/marca.interface';
import { MarcaService } from '../../../services/marca';
import { ServicioService } from '../../../services/servicio';
import { Servicio } from '../../../interfaces/servicio.interface';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
    marcas: Marca[] = [];
    servicios: Servicio[] = [];

  constructor(private marcaService: MarcaService, private servicioService: ServicioService) {}

  ngOnInit() {
    // nada mas cargar el componente, traemos las marcas del back para el dropdown
    this.marcaService.getMarcas().subscribe({
      next: (res) => {
        this.marcas = res;
      }
    });

    // Traemos los servicios del back
    this.servicioService.getServicios().subscribe({
      next: (res) => {
        this.servicios = res;
      }
    });
  }
}
