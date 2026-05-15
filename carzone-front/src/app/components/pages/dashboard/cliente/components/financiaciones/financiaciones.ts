import { Component, Input } from '@angular/core';
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

export class Financiaciones {

  @Input() financiaciones: Financiacion[] = [];
}