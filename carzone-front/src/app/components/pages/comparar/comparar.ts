import {  ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MarcaService } from '../../../services/marca';
import { CocheService } from '../../../services/coche';
import { Marca } from '../../../interfaces/marca.interface';
import { Coche } from '../../../interfaces/coche.interface';

interface Campo {
  // keyof es para asegurar que es de tipo coche
  key: keyof Coche;
  label: string;
  // mayor = más es mejor, menor = menos es mejor
  tipo: 'mayor' | 'menor' | 'texto';
}

@Component({
  selector: 'app-comparar',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './comparar.html',
  styleUrl: './comparar.scss'
})
export class Comparar implements OnInit {

  marcas: Marca[] = [];
  cochesA: Coche[] = [];
  cochesB: Coche[] = [];
  cocheA: Coche | null = null;
  cocheB: Coche | null = null;
  ganador: 'A' | 'B' | 'empate' = 'empate';

  campos: Campo[] = [
    { key: 'potencia',       label: 'Potencia',       tipo: 'mayor' },
    { key: 'par_motor',      label: 'Par Motor',      tipo: 'mayor' },
    { key: 'aceleracion',    label: '0-100 km/h',     tipo: 'menor' },
    { key: 'velocidad_max',  label: 'Vel. Máxima',  tipo: 'mayor' },
    { key: 'precio',         label: 'Precio',         tipo: 'menor' },
    { key: 'num_plazas',     label: 'Plazas',         tipo: 'mayor' },
    { key: 'transmision',    label: 'Transmisión',    tipo: 'texto' },
    { key: 'traccion',       label: 'Tracción',       tipo: 'texto' },
    { key: 'combustible',    label: 'Combustible',    tipo: 'texto' },
    { key: 'tipo_carroceria',label: 'Carrocería',     tipo: 'texto' },
  ];

  constructor(
    private marcaService: MarcaService,
    private cocheService: CocheService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.marcaService.getMarcas().subscribe(data => this.marcas = data);
  }

  // metodo para cojer las marcas seleccionadas, 
  // cargar los coches de esa marca y resetear la selección de coche y ganador
  onMarcaChange(event: Event, lado: 'A' | 'B') {
    const marcaId = (event.target as HTMLSelectElement).value;
    if (!marcaId) return;

    // cojemos los coches de la marca seleccionada y reseteamos la selección de coche
    this.cocheService.getCochesByMarca(marcaId).subscribe(data => {
      // si es el lado a o de la izquierda, 
      // guardamos los coches en cochesA y reseteamos cocheA, sino lo hacemos con el lado B
      if (lado === 'A') 
        { 
          this.cochesA = data; 
          this.cocheA = null; 
        }
      else { 
        this.cochesB = data; 
        this.cocheB = null; 
      }

      // ejecutamos el método para calcular el ganador, 
      // que se encargará de resetearlo si no hay coches seleccionados
      this.calcularGanador();
      // y detectamos cambios para que se actualice la vista
      this.cd.detectChanges();
    });
  }

  // metodo parecido al anterior pero para cargar el coche seleccionado y calcular el ganador
  onCocheChange(event: Event, lado: 'A' | 'B') {
    // cojemos el id del coche seleccionado
    const cocheId = Number((event.target as HTMLSelectElement).value);
    // si no hay id, salimos del método
    if (!cocheId) return;

    // igual que antes, cojemos el coche seleccionado y lo guardamos en la variable correspondiente al lado,
    this.cocheService.getCocheById(cocheId).subscribe(data => {
      if (lado === 'A') this.cocheA = data;
      else this.cocheB = data;

      // y ejecutamos el método para calcular el ganador
      this.calcularGanador();
      // y detectamos cambios para que se actualice la vista
      this.cd.detectChanges();
    });
  }

  // método para formatear el valor de un campo de un coche, dependiendo del tipo de campo
  getValor(coche: Coche, key: keyof Coche): string {
    const val = coche[key];
    if (val === null || val === undefined) return '—';
    if (key === 'precio')      return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(val));
    if (key === 'potencia')    return `${val} CV`;
    if (key === 'par_motor')   return `${val} Nm`;
    if (key === 'aceleracion') return `${val}s`;
    if (key === 'velocidad_max') return `${val} km/h`;
    if (key === 'num_plazas')  return `${val} plazas`;
    return String(val);
  }

  // método para determinar la clase CSS de un campo, dependiendo de si es mejor, peor o empate
  getClase(key: keyof Coche, lado: 'A' | 'B'): string {
    if (!this.cocheA || !this.cocheB) return '';

    // hacemos una funcion flecha para que en esta variable se guarde el 
    // campo correspondiente al key, y si no existe o es de tipo texto, devolvemos neutro
    const campo = this.campos.find(c => c.key === key);

    // si el campo no existe o es de tipo texto, devolvemos neutro
    if (!campo || campo.tipo === 'texto') return 'neutro';

    // cojemos el valor del campo para ambos coches, y si no existe, lo consideramos como 0
    const valA = Number(this.cocheA[key] ?? 0);
    const valB = Number(this.cocheB[key] ?? 0);

    // si los valores son iguales, devolvemos empate
    if (valA === valB) return 'empate';

    // dependiendo de si el campo es de tipo mayor o menor, consideramos que A es mejor que B o viceversa
    const aEsMejor = campo.tipo === 'mayor' ? valA > valB : valA < valB;

    // si A es mejor, el lado A es ganador y el B perdedor, sino al revés
    if (lado === 'A') return aEsMejor ? 'ganador' : 'perdedor';
    else return aEsMejor ? 'perdedor' : 'ganador';
  }

  // método para calcular el ganador total, contando cuántos campos gana cada coche
  calcularGanador() {
    if (!this.cocheA || !this.cocheB) return;

    // inicializamos los puntos de ambos coches a 0
    let puntosA = 0;
    let puntosB = 0;

    // miramos cada campo, y dependiendo de la clase que tenga para el lado A, sumamos un punto a A o a B
    this.campos.forEach(campo => {
      if (campo.tipo === 'texto') return;
      const clase = this.getClase(campo.key, 'A');
      if (clase === 'ganador') puntosA++;
      if (clase === 'perdedor') puntosB++;
    });

    // y ya calculamos el ganador comparando los puntos de ambos coches, o empate si tienen los mismos puntos
    if (puntosA > puntosB)      this.ganador = 'A';
    else if (puntosB > puntosA) this.ganador = 'B';
    else this.ganador = 'empate';
  }
}