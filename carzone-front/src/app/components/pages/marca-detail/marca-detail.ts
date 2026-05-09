import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarcaService } from '../../../services/marca';
import { CocheService } from '../../../services/coche';
import { Marca } from '../../../interfaces/marca.interface';
import { Coche } from '../../../interfaces/coche.interface';
import { CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-marca-detail',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './marca-detail.html',
  styleUrl: './marca-detail.scss',
})
export class MarcaDetail implements OnInit {
  marca: Marca | null = null;
  coches: Coche[] = [];
  isTransitioning = false;

  constructor(
    private route: ActivatedRoute,
    private marcaService: MarcaService,
    private cocheService: CocheService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      // fade out
      this.isTransitioning = true;
      this.cd.detectChanges();

      // esperamos a que lleguen marca y coches a la vez
      forkJoin({
        marca: this.marcaService.getMarcaById(id),
        coches: this.cocheService.getCochesByMarca(id)
      }).subscribe(({ marca, coches }) => {
        this.marca = marca;
        this.coches = coches;

        // fade in en el siguiente ciclo para que la transición CSS se aplique
        requestAnimationFrame(() => {
          this.isTransitioning = false;
          this.cd.detectChanges();
        });
      });
    });
  }
}