import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Coche } from '../../../interfaces/coche.interface';
import { CocheService } from '../../../services/coche';

@Component({
  selector: 'app-our-models',
  imports: [CommonModule],
  templateUrl: './our-models.html',
  styleUrl: './our-models.scss',
})
export class OurModels implements OnInit {
  coches: Coche[] = []
  // coches de la seccion de modelos destacados
  cochesDestacadosIds = [25, 51, 92, 40, 65, 59];

  constructor(private cocheService: CocheService) {}

  ngOnInit() {
    // Usar el método optimizado que filtra en el backend
    this.cocheService.getCochesDestacados(this.cochesDestacadosIds).subscribe({
      next: (res) => {
        this.coches = res;
        console.log('Coches destacados cargados:', this.coches);
      },
      error: (error) => {
        console.error('Error al cargar coches destacados:', error);
      }
    });
  }
}
