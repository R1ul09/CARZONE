import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CocheService } from '../../../services/coche';
import { Auth } from '../../../services/auth';
import { Coche } from '../../../interfaces/coche.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-coche-detail',
  imports: [CurrencyPipe],
  templateUrl: './coche-detail.html',
  styleUrl: './coche-detail.scss',
})
export class CocheDetail implements OnInit {

  coche: Coche | null = null;
  imagenActiva: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cocheService: CocheService,
    private authService: Auth,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cocheService.getCocheById(id).subscribe(data => {
      this.coche = data;
      this.imagenActiva = data.imagen_principal?.ruta
        ?? data.imagenes?.[0]?.ruta
        ?? '';
      this.cd.detectChanges();
    });
  }

  setImagen(ruta: string) {
    this.imagenActiva = ruta;
    this.cd.detectChanges();
  }

  pedirCita() {
    if (!this.authService.estaLogueado()) {
      this.router.navigate(['/login']);
    }
  }

  solicitarFinanciacion() {
    this.router.navigate(['/financiacion'], {
      queryParams: { coche: this.coche?.id }
    });
  }
}