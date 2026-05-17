import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Financiacion } from '../../../../../../interfaces/financiacion.interface';

@Component({
  selector: 'app-financiaciones',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './financiaciones.html',
  styleUrl: './financiaciones.scss'
})

export class Financiaciones implements OnChanges{

  @Input() financiaciones: Financiacion[] = [];

  ngOnChanges(changes: SimpleChanges) {
    // los getters se recalculan solos
  }
}