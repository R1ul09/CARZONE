import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarcaService } from '../../../services/marca';
import { CocheService, CocheOrden } from '../../../services/coche';
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
  marcaId: string | null = null;

  filtros = {
    disponible: null as number | null,
    tipo_carroceria: '',
    combustible: '',
    precio_max: '',
    orden: '' as CocheOrden | ''
  };

  constructor(
    private route: ActivatedRoute,
    private marcaService: MarcaService,
    private cocheService: CocheService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.marcaId = params.get('id');

      // fade out
      this.isTransitioning = true;
      this.cd.detectChanges();

      // carga marca y coches a la vez
      forkJoin({
        marca: this.marcaService.getMarcaById(this.marcaId),
        coches: this.cocheService.getCochesByMarcaConFiltros(this.marcaId, this.filtros)
      }).subscribe(({ marca, coches }) => {
        this.marca = marca;
        this.coches = coches;

        // fade in
        requestAnimationFrame(() => {
          this.isTransitioning = false;
          this.cd.detectChanges();
        });
      });
    });
  }

  cargarCoches() {
    this.cocheService.getCochesByMarcaConFiltros(this.marcaId, this.filtros)
      .subscribe(data => { 
          this.coches = data;
          this.cd.detectChanges();
        }
      );
  }

  setDisponible(valor: number | null) {
    this.filtros.disponible = valor;
    this.cargarCoches();
  }

  setCarroceria(event: Event) {
    this.filtros.tipo_carroceria = (event.target as HTMLSelectElement).value;
    this.cargarCoches();
  }

  setCombustible(event: Event) {
    this.filtros.combustible = (event.target as HTMLSelectElement).value;
    this.cargarCoches();
  }

  setPrecioMax(event: Event) {
    this.filtros.precio_max = (event.target as HTMLSelectElement).value;
    this.cargarCoches();
  }

  setOrden(event: Event) {
    this.filtros.orden = (event.target as HTMLSelectElement).value as CocheOrden | '';
    this.cargarCoches();
  }

  hayFiltrosActivos(): boolean {
    return this.filtros.disponible !== null ||
            this.filtros.tipo_carroceria !== '' ||
            this.filtros.combustible !== '' ||
            this.filtros.precio_max !== '' ||
            this.filtros.orden !== '';
  }

  resetFiltros() {
    this.filtros = {
      disponible: null,
      tipo_carroceria: '',
      combustible: '',
      precio_max: '',
      orden: ''
    };
    this.cargarCoches();
  }
}