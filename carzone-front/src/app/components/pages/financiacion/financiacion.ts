import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CocheService } from '../../../services/coche';
import { FinanciacionService } from '../../../services/financiacion';
import { Auth } from '../../../services/auth';
import { Coche } from '../../../interfaces/coche.interface';

// Clave usada para guardar los datos de la calculadora en sessionStorage
// mientras el usuario va a loguearse y vuelve
const STORAGE_KEY = 'financiacion_pendiente';

@Component({
  selector: 'app-financiacion',
  templateUrl: './financiacion.html',
  styleUrl: './financiacion.scss',
  imports: [FormsModule, CurrencyPipe]
})
export class Financiacion implements OnInit {

  coches: Coche[] = [];

  // Lista de marcas únicas extraídas de los coches (para el primer selector)
  marcas: string[] = [];

  // Marca seleccionada en el primer selector
  marcaSeleccionada: string = '';

  // Coches filtrados según la marca seleccionada
  cochesFiltrados: Coche[] = [];

  cocheSeleccionadoId: number | string = '';
  cocheSeleccionado: Coche | null = null;

  precioVehiculo: number = 200000;
  entrada: number = 40000;
  plazoSeleccionado: number = 60;
  plazos: number[] = [24, 36, 48, 60, 72, 84];
  interes: number = 3.9;
  cuotaMensual: number = 0;

  formData = { nombre: '', telefono: '', mensaje: '' };

  ventajas = [
    { texto: 'Aprobación en 24 horas' },
    { texto: 'Tasas competitivas desde 3,9% TAE' },
    { texto: 'Plazos hasta 84 meses' },
    { texto: 'Sin penalización por pago anticipado' },
    { texto: 'Financiación hasta el 100% del valor' },
    { texto: 'Asesor personal dedicado' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cocheService: CocheService,
    private financiacionService: FinanciacionService,
    private authService: Auth,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.cocheService.getTodosLosCoches().subscribe(coches => {
      this.coches = coches;

      // Extraemos las marcas únicas de todos los coches para el primer selector
      // basicamente lo que hacemos es mapear cada coche a su marca, 
      // luego creamos un Set para quedarnos solo con las marcas únicas, 
      // luego filtramos cualquier valor vacío o nulo (en caso de coches sin marca)
      this.marcas = [...new Set(coches.map(c => c.marca?.nombre).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b));
      
      // Si venimos de ?coche=X en la URL, preseleccionamos ese coche
      const cocheId = this.route.snapshot.queryParamMap.get('coche');
      if (cocheId) {
        this.cocheSeleccionadoId = Number(cocheId);
        this.aplicarCocheSeleccionado();
      }

      // Si el usuario acaba de loguearse y tenía una financiación pendiente,
      // la recuperamos del sessionStorage y la enviamos automáticamente
      this.enviarFinanciacionPendienteSiExiste();
    });

    this.calcular();
  }

  // Cuando cambia la marca, filtramos los coches y reseteamos la selección
  onMarcaChange() {
    this.cochesFiltrados = this.coches.filter(c => c.marca?.nombre === this.marcaSeleccionada);
    this.cocheSeleccionadoId = '';
    this.cocheSeleccionado = null;
  }

  // Cuando cambia el coche dentro de la marca seleccionada
  onCocheChange() {
    this.aplicarCocheSeleccionado();
  }

  // Busca el coche seleccionado y actualiza el precio y la entrada inicial
  private aplicarCocheSeleccionado() {
    this.cocheSeleccionado = this.coches.find(
      c => c.id === Number(this.cocheSeleccionadoId)
    ) ?? null;

    if (this.cocheSeleccionado) {
      // Preseleccionamos la marca en el selector si venimos de URL directa
      this.marcaSeleccionada = this.cocheSeleccionado.marca?.nombre ?? '';
      this.cochesFiltrados = this.coches.filter(c => c.marca?.nombre === this.marcaSeleccionada);

      this.precioVehiculo = this.cocheSeleccionado.precio;
      this.entrada = Math.round(this.cocheSeleccionado.precio * 0.2);
      this.calcular();
    }
  }

  setPlazo(plazo: number) {
    this.plazoSeleccionado = plazo;
    this.calcular();
  }

  calcular() {
    const capital = this.precioVehiculo - this.entrada;
    const tasaMensual = this.interes / 100 / 12;
    // n es el número total de pagos (meses)
    const n = this.plazoSeleccionado;
    if (capital <= 0) { this.cuotaMensual = 0; return; }
    // la formula es simplemente un redondeo del resultado de la fórmula estándar de amortización francesa
    this.cuotaMensual = Math.round(
      (capital * tasaMensual * Math.pow(1 + tasaMensual, n)) /
      (Math.pow(1 + tasaMensual, n) - 1)
    );
  }

  solicitar() {
    if (!this.cocheSeleccionadoId || !this.formData.nombre) {
      this.toastr.error('Por favor selecciona un vehículo y rellena tu nombre');
      return;
    }
    
    const datosFinanciacion = {
      coche_id: Number(this.cocheSeleccionadoId),
      meses: this.plazoSeleccionado,
      cuota_mensual: this.cuotaMensual,
      entrada: this.entrada,
      interes: this.interes,
      nombre_contacto: this.formData.nombre,
      telefono: this.formData.telefono,
      mensaje: this.formData.mensaje
    };

    if (!this.authService.estaLogueado()) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(datosFinanciacion));
      this.router.navigate(['/login']);
      return;
    }

    if (!this.cocheSeleccionadoId || !this.formData.nombre || !this.formData.telefono) {
      this.toastr.error('Por favor rellena todos los campos obligatorios');
      return;
    }

    this.enviarSolicitud(datosFinanciacion);
  }

  private enviarFinanciacionPendienteSiExiste() {
    const guardada = sessionStorage.getItem(STORAGE_KEY);
    if (!guardada || !this.authService.estaLogueado()) return;

    const datos = JSON.parse(guardada);
    sessionStorage.removeItem(STORAGE_KEY);

    // Restauramos los valores en la calculadora y formulario
    this.cocheSeleccionadoId = datos.coche_id;
    this.plazoSeleccionado = datos.meses;
    this.entrada = datos.entrada;
    this.interes = datos.interes;
    
    // Restauramos los datos del formulario
    this.formData.nombre = datos.nombre_contacto || '';
    this.formData.telefono = datos.telefono || '';
    this.formData.mensaje = datos.mensaje || '';
    
    this.aplicarCocheSeleccionado();

    this.toastr.info('Enviando tu solicitud de financiación...');
    setTimeout(() => {
      this.enviarSolicitud(datos);
    }, 500);
  }

  // Método que hace el envío real al backend
  private enviarSolicitud(datos: any) {
    this.financiacionService.solicitarFinanciacion(datos).subscribe({
      next: () => {
        this.toastr.success('Solicitud enviada. Nos pondremos en contacto contigo pronto.');
        
        this.cocheSeleccionadoId = '';
        this.formData = { nombre: '', telefono: '', mensaje: '' };
        
        this.router.navigate(['/dashboard'], { queryParams: { section: 'financiaciones' } });
      },
      error: (err) => {
        console.error('Error detallado del backend:', err);
        this.toastr.error('Ha ocurrido un error. Inténtalo de nuevo.');
      }
    });
  }
}