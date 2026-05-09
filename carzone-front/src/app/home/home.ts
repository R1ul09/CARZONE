import { Component } from '@angular/core';
import { Hero } from '../components/home/hero/hero';
import { OurModels } from '../components/home/our-models/our-models';
import { Reviews } from '../components/home/reviews/reviews';

@Component({
  selector: 'app-home',
  imports: [Hero, OurModels, Reviews],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
